/**
 * BOMAENGWE WELFARE — Login Page
 * Firebase Authentication + Demo mode support
 */

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/hero-community-8XzPUxPGXACeLERq9Pv9QR.webp"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
              alt="Logo"
              className="w-12 h-12"
            />
            <div>
              <p className="font-bold text-xl" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE</p>
              <p className="text-white/70 text-sm">WELFARE MANAGEMENT SYSTEM</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Welcome Back
          </h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Access your welfare society dashboard to manage contributions, loans, and community welfare programs.
          </p>
          <div className="space-y-3">
            {[
              'Real-time financial tracking',
              'Secure role-based access',
              'Mobile-friendly interface',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/80">
                <Shield className="w-4 h-4 text-emerald-300" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
              alt="Logo"
              className="w-8 h-8"
            />
            <div>
              <p className="font-bold text-sm text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE WELFARE</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Sign in to your account
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">Register here</Link>
          </p>

          {/* Demo credentials */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-primary mb-2">🎯 Demo Credentials — Click to fill:</p>
            <div className="flex flex-wrap gap-2">
              {(['admin', 'committee', 'member'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors capitalize"
                >
                  {role === 'admin' ? '👑 Admin' : role === 'committee' ? '🏛 Committee' : '👤 Member'}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Password: <code className="bg-muted px-1 rounded">demo123</code></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
