/**
 * BOMAENGWE WELFARE — Forgot Password Page
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  async function onSubmit(data: { email: string }) {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Failed to send reset email. Check your email address.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
            alt="Logo"
            className="w-10 h-10"
          />
          <div>
            <p className="font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE WELFARE</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                Check your email
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a password reset link to your email address. Check your inbox and follow the instructions.
              </p>
              <Link href="/login">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                Forgot your password?
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    className="mt-1.5"
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <Link href="/login">
                <button className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
