'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Wrench, Mail, Lock, ArrowRight, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { toast } from 'sonner';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Missing fields', { description: 'Please enter both email and password.' });
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const loggedInUser = await login(email, password);
      toast.success('Welcome back!', {
        description: `Signed in as ${loggedInUser.name || loggedInUser.email}`,
      });

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (loggedInUser.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (loggedInUser.role === 'technician') {
        router.push('/dashboard/technician');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in. Please check your credentials.';
      setErrorMsg(msg);
      toast.error('Authentication failed', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F3EE]/40">
      <Card className="w-full max-w-md shadow-md border-border/80">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#202522] text-white shadow-xs mb-2">
            <Wrench className="h-6 w-6 text-[#F26A3D]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-[#202522] font-heading">
            Sign in to FixMate
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Access your bookings, technician job queue, or admin moderation
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Password
                </label>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Quick Demo Credentials */}
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs space-y-1.5">
              <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                Demo Accounts (Click to test):
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('customer1@fixmate.io');
                    setPassword('Password123!');
                  }}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-medium hover:bg-muted"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('tech1@fixmate.io');
                    setPassword('Password123!');
                  }}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-medium hover:bg-muted"
                >
                  Technician
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@fixmate.io');
                    setPassword('Password123!');
                  }}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-[11px] font-medium hover:bg-muted"
                >
                  Admin
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-semibold text-sm rounded-xl py-2.5 shadow-xs"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In to FixMate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="font-semibold text-[#F26A3D] hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8">Loading...</div>}>
        <LoginForm />
      </Suspense>
      <Footer />
    </div>
  );
}
