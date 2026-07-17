/**
 * BOMAENGWE WELFARE — Registration Page
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
import { Eye, EyeOff, UserPlus } from 'lucide-react';

interface RegisterForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  occupation: string;
  village: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const [, navigate] = useLocation();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  async function onSubmit(data: RegisterForm) {
    setLoading(true);
    try {
      await registerUser(data.email, data.password, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        nationalId: data.nationalId,
        occupation: data.occupation,
        village: data.village,
        nextOfKinName: data.nextOfKinName,
        nextOfKinPhone: data.nextOfKinPhone,
      });
      toast.success('Registration successful! Welcome to BOMAENGWE WELFARE.');
      navigate('/member');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
              alt="Logo"
              className="w-10 h-10"
            />
          </Link>
          <div>
            <p className="font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE WELFARE</p>
            <p className="text-xs text-muted-foreground">Member Registration</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            Create your account
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Already a member?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border" style={{ fontFamily: 'Sora, sans-serif' }}>
                Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Full Name *</Label>
                  <Input
                    className="mt-1"
                    placeholder="John Kamau Mwangi"
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">National ID *</Label>
                  <Input
                    className="mt-1"
                    placeholder="12345678"
                    {...register('nationalId', { required: 'National ID is required' })}
                  />
                  {errors.nationalId && <p className="text-xs text-destructive mt-1">{errors.nationalId.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">Phone Number *</Label>
                  <Input
                    className="mt-1"
                    placeholder="+254712345678"
                    {...register('phoneNumber', { required: 'Phone number is required' })}
                  />
                  {errors.phoneNumber && <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">Email Address *</Label>
                  <Input
                    type="email"
                    className="mt-1"
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">Occupation</Label>
                  <Input className="mt-1" placeholder="Teacher, Farmer, etc." {...register('occupation')} />
                </div>
                <div>
                  <Label className="text-xs font-medium">Village *</Label>
                  <Input
                    className="mt-1"
                    placeholder="Kiambu"
                    {...register('village', { required: 'Village is required' })}
                  />
                  {errors.village && <p className="text-xs text-destructive mt-1">{errors.village.message}</p>}
                </div>
              </div>
            </div>

            {/* Next of Kin */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border" style={{ fontFamily: 'Sora, sans-serif' }}>
                Next of Kin
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Next of Kin Name *</Label>
                  <Input
                    className="mt-1"
                    placeholder="Mary Kamau"
                    {...register('nextOfKinName', { required: 'Next of kin name is required' })}
                  />
                  {errors.nextOfKinName && <p className="text-xs text-destructive mt-1">{errors.nextOfKinName.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">Next of Kin Phone *</Label>
                  <Input
                    className="mt-1"
                    placeholder="+254723456789"
                    {...register('nextOfKinPhone', { required: 'Next of kin phone is required' })}
                  />
                  {errors.nextOfKinPhone && <p className="text-xs text-destructive mt-1">{errors.nextOfKinPhone.message}</p>}
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border" style={{ fontFamily: 'Sora, sans-serif' }}>
                Account Security
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Password *</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      className="pr-10"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <Label className="text-xs font-medium">Confirm Password *</Label>
                  <Input
                    type="password"
                    className="mt-1"
                    placeholder="Repeat password"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (v) => v === password || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2 mt-2" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By registering, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
        </p>
      </motion.div>
    </div>
  );
}
