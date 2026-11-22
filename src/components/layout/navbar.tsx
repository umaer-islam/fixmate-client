'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench, User, LogOut, LayoutDashboard, Menu, X, Shield, Settings, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getDashboardHref = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'technician') return '/dashboard/technician';
    return '/dashboard/customer';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-102">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202522] text-white shadow-sm">
            <Wrench className="h-5 w-5 text-[#F26A3D]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#202522] font-heading">
              Fix<span className="text-[#F26A3D]">Mate</span>
            </span>
            <span className="hidden sm:block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Repair Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#F26A3D] ${
                  isActive ? 'text-[#F26A3D] font-semibold' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Auth CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card p-1.5 pr-3 shadow-xs transition-all hover:bg-muted focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#202522] text-white font-semibold text-xs overflow-hidden">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold leading-none text-foreground">{user.name || 'My Account'}</p>
                  <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{role}</p>
                </div>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-lg animate-in fade-in zoom-in-95"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="p-2 border-b border-border/60 mb-1">
                    <p className="text-xs font-semibold text-foreground truncate">{user.name || 'FixMate User'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-1.5">
                      <Badge variant={role === 'admin' ? 'default' : role === 'technician' ? 'orange' : 'sage'}>
                        {role?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href={getDashboardHref()}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#F26A3D]" />
                    <span>Dashboard</span>
                  </Link>

                  {role === 'customer' && (
                    <Link
                      href="/dashboard/customer/bookings"
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>My Bookings</span>
                    </Link>
                  )}

                  {role === 'technician' && (
                    <Link
                      href="/dashboard/technician/my-services"
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>My Services</span>
                    </Link>
                  )}

                  {role === 'admin' && (
                    <Link
                      href="/dashboard/admin/services"
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>Service Moderation</span>
                    </Link>
                  )}

                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Profile Settings</span>
                  </Link>

                  <div className="border-t border-border/60 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="font-semibold text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-semibold text-xs rounded-xl shadow-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-border p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#202522] text-white text-xs">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Dashboard ({role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center bg-[#F26A3D] text-white text-xs">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
