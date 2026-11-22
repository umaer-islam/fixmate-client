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
import { ServiceFilterBar } from '@/components/services/service-filter-bar';
import { ServiceCard } from '@/components/services/service-card';

export interface ServiceItem {
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
      <ServiceFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
          updateQueryAndUrl({ search: val, page: 1 });
        }}
        serviceMode={serviceMode}
        onServiceModeChange={(val) => {
          setServiceMode(val);
          setPage(1);
          updateQueryAndUrl({ serviceMode: val, page: 1 });
        }}
        sort={sort}
        onSortChange={(val) => {
          setSort(val);
          setPage(1);
          updateQueryAndUrl({ sort: val, page: 1 });
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
          updateQueryAndUrl({ category: val, page: 1 });
        }}
        onReset={handleResetFilters}
      />

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
              <ServiceCard key={service._id} service={service} />
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
