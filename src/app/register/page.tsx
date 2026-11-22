'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Missing required fields');
      return;
    }
    if (password.length < 8) {
      toast.error('Password too short', { description: 'Password must be at least 8 characters.' });
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const newUser = await register(name, email, password, role);
      toast.success('Registration successful!', {
        description: `Welcome to FixMate, ${newUser.name || 'Friend'}!`,
      });

      if (role === 'technician') {
        router.push('/dashboard/technician');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Email may already be in use.';
      setErrorMsg(msg);
      toast.error('Registration error', { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F3EE]/40">
        <Card className="w-full max-w-md shadow-md border-border/80">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#202522] text-white shadow-xs mb-2">
              <Wrench className="h-6 w-6 text-[#F26A3D]" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-[#202522] font-heading">
              Join FixMate Today
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Create an account to book verified repairs or offer repair services
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                  {errorMsg}
                </div>
              )}

              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  I want to join as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`rounded-xl border p-2.5 text-xs font-medium transition-all text-center ${
                      role === 'customer'
                        ? 'border-[#F26A3D] bg-[#F26A3D]/10 text-[#F26A3D] font-bold'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Customer
                    <span className="block text-[10px] font-normal text-muted-foreground mt-0.5">
                      Need repairs done
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('technician')}
                    className={`rounded-xl border p-2.5 text-xs font-medium transition-all text-center ${
                      role === 'technician'
                        ? 'border-[#F26A3D] bg-[#F26A3D]/10 text-[#F26A3D] font-bold'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Technician
                    <span className="block text-[10px] font-normal text-muted-foreground mt-0.5">
                      Offer repair services
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="rounded-xl bg-[#DCE8DE]/40 border border-[#DCE8DE] p-3 text-xs text-[#202522] space-y-1">
                <p className="flex items-center gap-1.5 font-semibold text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  FixMate Guarantee
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Every booking is protected. Pay only after work is completed and verified through Stripe.
                </p>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create {role === 'technician' ? 'Technician' : 'Customer'} Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Already registered?{' '}
                <Link href="/login" className="font-semibold text-[#F26A3D] hover:underline">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
