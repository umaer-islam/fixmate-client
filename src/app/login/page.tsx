'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Wrench, Mail, Lock, ArrowRight, Loader2, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { MotionButton } from '@/components/motion/motion-button';
import { buttonTapSpring } from '@/lib/motion/tokens';
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

  const demoAccounts = [
    { label: 'Customer', email: 'customer@fixmate.io', pass: 'Password123!' },
    { label: 'Tech (Marcus)', email: 'marcus.tech@fixmate.io', pass: 'Password123!' },
    { label: 'Tech (Elena)', email: 'elena.tech@fixmate.io', pass: 'Password123!' },
    { label: 'Admin', email: 'admin@fixmate.io', pass: 'Password123!' },
  ];

  return (
    <div className="flex flex-1 items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F3EE]/40">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-md border-border/80 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1.5 text-center pt-8 pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#202522] text-white shadow-xs mb-2">
              <Wrench className="h-7 w-7 text-[#F26A3D]" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight text-[#202522] font-heading">
              Sign in to FixMate
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Access your bookings, technician job queue, or admin console
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6 sm:px-8">
              {errorMsg && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
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
                  className="rounded-xl h-11 border-border focus-visible:ring-[#F26A3D]/30 focus-visible:border-[#F26A3D]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
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
                  className="rounded-xl h-11 border-border focus-visible:ring-[#F26A3D]/30 focus-visible:border-[#F26A3D]"
                />
              </div>

              {/* Quick Demo Credentials */}
              <div className="rounded-2xl border border-border/70 bg-[#F5F3EE]/70 p-3.5 text-xs space-y-2">
                <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F26A3D]" />
                  <span>Demo Accounts (Click to test):</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {demoAccounts.map((acc) => (
                    <motion.button
                      key={acc.label}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={buttonTapSpring}
                      onClick={() => {
                        setEmail(acc.email);
                        setPassword(acc.pass);
                      }}
                      className="rounded-xl border border-border/80 bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:border-[#F26A3D]/60 hover:text-[#F26A3D] transition-colors shadow-2xs"
                    >
                      {acc.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-8 pt-2">
              <MotionButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full text-sm font-bold"
              >
                <span>Sign In to FixMate</span>
                <ArrowRight className="w-4 h-4" />
              </MotionButton>

              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account yet?{' '}
                <Link href="/register" className="font-bold text-[#F26A3D] hover:underline">
                  Create Account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-xs text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
      <Footer />
    </div>
  );
}
