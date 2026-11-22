'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Wrench,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  serviceMode: string;
  basePrice: number;
  estimatedDuration: string;
  image: string;
  technicianName: string;
  serviceArea?: string;
}

const CATEGORIES = [
  'All',
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const MODES = [
  { label: 'All Modes', value: '' },
  { label: 'Home Visit', value: 'Home Visit' },
  { label: 'Shop Drop-off', value: 'Shop Drop-off' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

function ServicesCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialMode = searchParams.get('serviceMode') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [serviceMode, setServiceMode] = useState(initialMode);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Sync to URL
  const updateQueryAndUrl = useCallback(
    (newParams: {
      search?: string;
      category?: string;
      serviceMode?: string;
      sort?: string;
      page?: number;
    }) => {
      const p = new URLSearchParams();
      const currentSearch = newParams.search !== undefined ? newParams.search : search;
      const currentCategory = newParams.category !== undefined ? newParams.category : category;
      const currentMode = newParams.serviceMode !== undefined ? newParams.serviceMode : serviceMode;
      const currentSort = newParams.sort !== undefined ? newParams.sort : sort;
      const currentPage = newParams.page !== undefined ? newParams.page : page;

      if (currentSearch.trim()) p.set('search', currentSearch.trim());
      if (currentCategory && currentCategory !== 'All') p.set('category', currentCategory);
      if (currentMode) p.set('serviceMode', currentMode);
      if (currentSort && currentSort !== 'newest') p.set('sort', currentSort);
      if (currentPage > 1) p.set('page', currentPage.toString());

      router.push(`/services?${p.toString()}`, { scroll: false });
    },
    [search, category, serviceMode, sort, page, router]
  );

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.set('search', search.trim());
        if (category && category !== 'All') queryParams.set('category', category);
        if (serviceMode) queryParams.set('serviceMode', serviceMode);
        if (sort) queryParams.set('sort', sort);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9');

        const res = await api.get(`/services?${queryParams.toString()}`);
        if (res.success && res.data) {
          setServices(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error('Failed to fetch services', err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [search, category, serviceMode, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setServiceMode('');
    setSort('newest');
    setPage(1);
    router.push('/services');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
          Verified Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202522] font-heading">
          Explore Repair Services
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Browse approved repair services from vetted local technicians. Zero upfront payment required.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by issue, device model, or technician..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                updateQueryAndUrl({ search: e.target.value, page: 1 });
              }}
              className="pl-10"
            />
          </div>

          {/* Service Mode Dropdown */}
          <div className="md:col-span-3">
            <select
              value={serviceMode}
              onChange={(e) => {
                setServiceMode(e.target.value);
                setPage(1);
                updateQueryAndUrl({ serviceMode: e.target.value, page: 1 });
              }}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
                updateQueryAndUrl({ sort: e.target.value, page: 1 });
              }}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="h-10 px-3 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
                updateQueryAndUrl({ category: cat, page: 1 });
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-all ${
                category === cat
                  ? 'bg-[#202522] text-white shadow-xs'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-4 space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id} className="overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-muted/60 overflow-hidden">
                  {service.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Wrench className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant="sage" className="capitalize font-semibold text-[11px]">
                      {service.serviceMode}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="text-[11px]">
                      {service.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-[#F26A3D] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {service.estimatedDuration}
                    </span>
                    <span className="font-semibold text-foreground">
                      Tech: {service.technicianName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Estimated Base</p>
                      <p className="text-xl font-black text-[#202522]">
                        ${service.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <Link href={`/services/${service._id}`}>
                      <Button size="sm" className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-semibold text-xs rounded-xl shadow-xs">
                        View & Book
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-6">
              <p className="text-xs text-muted-foreground">
                Showing Page <span className="font-semibold text-foreground">{pagination.page}</span> of{' '}
                <span className="font-semibold text-foreground">{pagination.totalPages}</span> ({pagination.totalCount} total services)
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    updateQueryAndUrl({ page: newPage });
                  }}
                  className="rounded-xl text-xs"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => {
                    const newPage = Math.min(pagination.totalPages, page + 1);
                    setPage(newPage);
                    updateQueryAndUrl({ page: newPage });
                  }}
                  className="rounded-xl text-xs"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-4">
          <Wrench className="h-10 w-10 mx-auto text-muted-foreground" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No matching repair services found</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any services matching your filters. Try clearing your search term or selecting another category.
            </p>
          </div>
          <Button onClick={handleResetFilters} variant="outline" size="sm" className="rounded-xl text-xs">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center">Loading services catalog...</div>}>
          <ServicesCatalog />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
