'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Shield,
  Settings,
  Briefcase,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motionSprings, buttonTapSpring } from '@/lib/motion/tokens';

export function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/80 bg-[#F5F3EE]/90 backdrop-blur-md shadow-xs py-1'
          : 'border-b border-border/40 bg-[#F5F3EE]/70 backdrop-blur-sm py-2'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.05 }}
            whileTap={buttonTapSpring}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202522] text-white shadow-xs"
          >
            <Wrench className="h-5 w-5 text-[#F26A3D] group-hover:text-white transition-colors" />
          </motion.div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#202522] font-heading">
              Fix<span className="text-[#F26A3D]">Mate</span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground -mt-0.5">
              Precision Repair
            </span>
          </div>
        </Link>

        {/* Desktop Navigation with Animated Active Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-2xl border border-border/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-1.5 text-xs font-bold transition-colors select-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    transition={motionSprings.snappy}
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-border/70"
                  />
                )}
                <span
                  className={`relative z-10 ${
                    isActive ? 'text-[#F26A3D]' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User / Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={buttonTapSpring}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card p-1 pr-3 shadow-xs hover:border-[#F26A3D]/40 transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#202522] text-white font-bold text-xs overflow-hidden">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                  ) : (
                    <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-none text-foreground">{user.name || 'My Account'}</p>
                  <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{role}</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={motionSprings.snappy}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl z-50"
                  >
                    <div className="p-2 border-b border-border/60 mb-1">
                      <p className="text-xs font-bold text-foreground truncate">{user.name || 'FixMate User'}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <Badge variant={role === 'admin' ? 'default' : role === 'technician' ? 'orange' : 'sage'}>
                          {role?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <Link
                      href={getDashboardHref()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#F26A3D]" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard/customer/bookings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{role === 'customer' ? 'My Bookings' : 'Booked Repairs'}</span>
                    </Link>

                    {role === 'technician' && (
                      <Link
                        href="/dashboard/technician/my-services"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>My Services</span>
                      </Link>
                    )}

                    {role === 'admin' && (
                      <Link
                        href="/dashboard/admin/services"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Service Moderation</span>
                      </Link>
                    )}

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Profile Settings</span>
                    </Link>

                    <div className="border-t border-border/60 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="font-bold text-xs rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={buttonTapSpring}>
                  <Button size="sm" className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-bold text-xs rounded-xl shadow-xs">
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            whileTap={buttonTapSpring}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-border p-2 text-foreground bg-card"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={motionSprings.snappy}
            className="md:hidden border-b border-border bg-card px-4 py-4 space-y-3 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                      isActive ? 'bg-[#202522] text-[#F5F3EE]' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border pt-3">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 rounded-xl">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#202522] text-white text-xs font-bold">
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    Open Dashboard ({role})
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center text-xs font-bold rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-[#F26A3D] text-white text-xs font-bold rounded-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
