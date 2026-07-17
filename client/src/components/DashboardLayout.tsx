/**
 * BOMAENGWE WELFARE — Dashboard Layout
 * Persistent sidebar + top header layout for all authenticated pages
 * Design: Modern Community Hub — Deep Teal sidebar, clean white content area
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard, Users, CreditCard, HandHeart,
  CalendarDays, Megaphone, BarChart3, Settings, Bell,
  LogOut, User, Menu, X, Moon, Sun, ChevronRight,
  TrendingUp, Shield, Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('admin' | 'committee' | 'member')[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'committee', 'member'] },
  { label: 'Members', href: '/members', icon: Users, roles: ['admin', 'committee'] },
  { label: 'Contributions', href: '/contributions', icon: CreditCard, roles: ['admin', 'committee', 'member'] },

  { label: 'Welfare', href: '/welfare', icon: HandHeart, roles: ['admin', 'committee', 'member'] },
  { label: 'Meetings', href: '/meetings', icon: CalendarDays, roles: ['admin', 'committee', 'member'] },
  { label: 'Announcements', href: '/announcements', icon: Megaphone, roles: ['admin', 'committee', 'member'] },
  { label: 'Finances', href: '/finances', icon: TrendingUp, roles: ['admin', 'committee'] },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'committee'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { userProfile, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const visibleNav = NAV_ITEMS.filter((item) => role && item.roles.includes(role));

  const getDashboardHref = () => {
    if (role === 'admin') return '/admin';
    if (role === 'committee') return '/committee';
    return '/member';
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return location === getDashboardHref() || location === '/dashboard';
    return location.startsWith(href);
  };

  async function handleLogout() {
    await logout();
    window.location.href = '/';
  }

  const initials = userProfile?.fullName
    ? userProfile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'committee' ? 'Committee' : 'Member';
  const roleBadgeColor = role === 'admin' ? 'bg-red-500' : role === 'committee' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-250 ease-out',
          'bg-sidebar text-sidebar-foreground',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:flex'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
              alt="BOMAENGWE WELFARE"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-white leading-tight font-display" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE</p>
            <p className="text-xs text-sidebar-foreground/60 leading-tight">WELFARE</p>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border-2 border-sidebar-primary/40">
              <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-foreground text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{userProfile?.fullName || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn('w-1.5 h-1.5 rounded-full', roleBadgeColor)} />
                <span className="text-xs text-sidebar-foreground/60">{roleLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-0.5">
            {visibleNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href === '/dashboard' ? getDashboardHref() : item.href}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                      active
                        ? 'bg-sidebar-accent text-white font-medium'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-sidebar-primary' : '')} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge className="h-4 px-1.5 text-xs bg-red-500 text-white border-0">
                        {item.badge}
                      </Badge>
                    )}
                    {active && <ChevronRight className="w-3 h-3 text-sidebar-primary" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          <Link href="/profile" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white transition-all">
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border h-14 flex items-center px-4 gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            {title && (
              <div>
                <h1 className="text-base font-semibold text-foreground truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {title}
                </h1>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <Link href="/notifications">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </Link>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block max-w-24 truncate">
                    {userProfile?.fullName?.split(' ')[0] || 'User'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userProfile?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile"><span className="flex items-center gap-2 w-full"><User className="w-4 h-4" /> Profile</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications"><span className="flex items-center gap-2 w-full"><Bell className="w-4 h-4" /> Notifications</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="page-enter"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
