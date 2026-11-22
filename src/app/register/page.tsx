'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Wrench, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth, UserRole } from '@/providers/auth-provider';
import { MotionButton } from '@/components/motion/motion-button';
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
                Join FixMate Today
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Create an account to book verified repairs or offer repair services
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-6 sm:px-8">
                {errorMsg && (
                  <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
                    {errorMsg}
                  </div>
                )}

                {/* Role Selection Tabs with Animated Pill */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    I want to join as:
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-[#F5F3EE]/70 p-1.5 rounded-2xl border border-border/70">
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`relative rounded-xl p-2.5 text-xs font-bold transition-all text-center ${
                        role === 'customer' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {role === 'customer' && (
                        <motion.div
                          layoutId="register-role-pill"
                          className="absolute inset-0 bg-[#202522] rounded-xl shadow-xs"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 block">Customer</span>
                      <span className="relative z-10 block text-[10px] font-normal opacity-80 mt-0.5">
                        Need repairs done
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('technician')}
                      className={`relative rounded-xl p-2.5 text-xs font-bold transition-all text-center ${
                        role === 'technician' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {role === 'technician' && (
                        <motion.div
                          layoutId="register-role-pill"
                          className="absolute inset-0 bg-[#202522] rounded-xl shadow-xs"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 block">Technician</span>
                      <span className="relative z-10 block text-[10px] font-normal opacity-80 mt-0.5">
                        Offer repair services
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    Full Name
                  </label>
                  <Input
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="rounded-xl h-11 border-border focus-visible:ring-[#F26A3D]/30 focus-visible:border-[#F26A3D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
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
                    className="rounded-xl h-11 border-border focus-visible:ring-[#F26A3D]/30 focus-visible:border-[#F26A3D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
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
                    className="rounded-xl h-11 border-border focus-visible:ring-[#F26A3D]/30 focus-visible:border-[#F26A3D]"
                  />
                </div>

                <div className="rounded-2xl bg-[#DCE8DE]/40 border border-[#DCE8DE] p-3 text-xs text-[#202522] space-y-1">
                  <p className="flex items-center gap-1.5 font-bold text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    FixMate Quality Guarantee
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Every booking is protected. Pay only after work is completed and verified through Stripe.
                  </p>
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
                  <span>Create {role === 'technician' ? 'Technician' : 'Customer'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </MotionButton>

                <p className="text-center text-xs text-muted-foreground">
                  Already registered?{' '}
                  <Link href="/login" className="font-bold text-[#F26A3D] hover:underline">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
