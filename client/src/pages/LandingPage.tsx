/**
 * BOMAENGWE WELFARE — Landing Page
 * Sections: Hero, About, Benefits, Features, Statistics, Testimonials, Contact, Footer
 * Design: Modern Community Hub — asymmetric layout, deep teal palette
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, CreditCard, HandHeart, Landmark, CalendarDays,
  BarChart3, Shield, Smartphone, Globe, CheckCircle2,
  ArrowRight, Mail, Phone, MapPin, Star, TrendingUp,
  ChevronDown, Menu, X, Moon, Sun,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const STATS = [
  { label: 'Active Members', value: '500+', icon: Users },
  { label: 'Total Contributions', value: 'KES 2.5M+', icon: CreditCard },
  { label: 'Welfare Disbursed', value: 'KES 800K+', icon: HandHeart },
  { label: 'Loans Processed', value: '120+', icon: Landmark },
];

const FEATURES = [
  {
    icon: Users, title: 'Member Management',
    desc: 'Complete member registry with digital ID cards, QR verification, and profile management.',
    color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
  },
  {
    icon: CreditCard, title: 'Contribution Tracking',
    desc: 'Record monthly contributions, generate receipts, and track outstanding balances automatically.',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    icon: Landmark, title: 'Loan Management',
    desc: 'Full loan lifecycle from application to repayment with automatic amortization calculations.',
    color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  {
    icon: HandHeart, title: 'Welfare Assistance',
    desc: 'Streamlined welfare request workflow covering medical, funeral, education, and emergency needs.',
    color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    icon: BarChart3, title: 'Financial Reports',
    desc: 'Comprehensive financial statements, audit trails, and exportable PDF/Excel reports.',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  },
  {
    icon: Smartphone, title: 'M-Pesa Integration',
    desc: 'Seamless M-Pesa Daraja API integration for contributions, loan repayments, and disbursements.',
    color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  },
];

const BENEFITS = [
  'Transparent financial management with real-time reporting',
  'Automated contribution reminders via SMS and email',
  'Secure role-based access for admins, committee, and members',
  'Digital member ID cards with QR code verification',
  'Multi-language support: English and Swahili',
  'Mobile-friendly design for easy access anywhere',
  'Automated loan amortization and penalty calculations',
  'Complete audit trail for all financial transactions',
];

const TESTIMONIALS = [
  {
    name: 'Mary Wanjiku', role: 'Chairperson, Kiambu Welfare Group',
    text: 'BOMAENGWE WELFARE transformed how we manage our society. The transparency and ease of use have increased member trust significantly.',
    rating: 5,
  },
  {
    name: 'James Otieno', role: 'Treasurer, Kisumu Community Fund',
    text: 'The loan management module alone has saved us countless hours. Automatic calculations and reminders have reduced defaults by 40%.',
    rating: 5,
  },
  {
    name: 'Grace Njoroge', role: 'Secretary, Thika Welfare Society',
    text: 'Our members love the mobile-friendly interface. They can check their contribution history and apply for welfare from their phones.',
    rating: 5,
  },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
              alt="Logo"
              className="w-8 h-8"
            />
            <div>
              <p className={cn('font-bold text-sm leading-tight', scrolled ? 'text-foreground' : 'text-white')} style={{ fontFamily: 'Sora, sans-serif' }}>
                BOMAENGWE
              </p>
              <p className={cn('text-xs leading-tight', scrolled ? 'text-muted-foreground' : 'text-white/70')}>
                WELFARE
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          {['About', 'Features', 'Benefits', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
              )}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={cn('p-2 rounded-lg transition-colors', scrolled ? 'hover:bg-muted text-muted-foreground' : 'hover:bg-white/10 text-white/70')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={cn(scrolled ? '' : 'text-white hover:bg-white/10 hover:text-white')}
            >
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className={cn(scrolled ? 'bg-primary hover:bg-primary/90' : 'bg-white text-primary hover:bg-white/90')}
            >
              Register
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            className={cn('md:hidden p-2 rounded-lg', scrolled ? 'text-foreground' : 'text-white')}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-border px-4 py-4 space-y-3">
          {['About', 'Features', 'Benefits', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/hero-community-8XzPUxPGXACeLERq9Pv9QR.webp"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E]/95 via-[#0F766E]/80 to-[#0F766E]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              🏡 Community Welfare Management
            </Badge>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Your Welfare,
              <br />
              <span className="text-emerald-300">Managed</span>
              <br />
              with Care
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              BOMAENGWE WELFARE brings transparency, trust, and technology to your community welfare society. From contributions to loans, we've got every member covered.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold gap-2">
                  Join the Community <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  Member Login
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/dashboard-preview-9WMQS5XoAdGEpSfxRhe5Bn.webp"
                  alt="Dashboard Preview"
                  className="w-full"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-sm font-bold text-foreground">KES 45,000</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── About Section ─────────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/community-meeting-Sk9xEie33ftdZYKeNhxTyu.webp"
                  alt="Community Meeting"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">About Us</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Built for African Community Welfare Societies
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                BOMAENGWE WELFARE is a comprehensive digital platform designed specifically for village and community welfare societies across Africa. We understand the unique needs of community-based organizations and have built a system that is both powerful and easy to use.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                From a small village group of 20 members to a large urban welfare society with 10,000 members, our platform scales to meet your needs while maintaining the community warmth that makes welfare societies special.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Bank-grade security</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>English & Swahili</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span>Mobile-first design</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Benefits Section ──────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/about-bg-MYWJtPdHcff723YeMJLRSA.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-primary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Benefits</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Why Choose BOMAENGWE WELFARE?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              Everything Your Society Needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools designed to make managing your welfare society effortless and transparent.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-6 bg-card rounded-2xl border border-border shadow-sm card-hover"
                >
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Statistics Section ────────────────────────────────────────────── */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Members' },
              { value: 'KES 2.5M+', label: 'Total Contributions' },
              { value: '120+', label: 'Loans Processed' },
              { value: '98%', label: 'Member Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat.value}
                </p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Trusted by Community Leaders
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 bg-card rounded-2xl border border-border shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Section ───────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Contact Us</Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions about BOMAENGWE WELFARE? Our team is here to help you get started.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'info@bomaengwe.org' },
                  { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
                  { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Send us a message
              </h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-sidebar text-sidebar-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
                  alt="Logo"
                  className="w-8 h-8"
                />
                <div>
                  <p className="font-bold text-sm text-white" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE</p>
                  <p className="text-xs text-sidebar-foreground/60">WELFARE</p>
                </div>
              </div>
              <p className="text-sm text-sidebar-foreground/60 leading-relaxed">
                Where community grows together. Empowering welfare societies across Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Platform</h4>
              <ul className="space-y-2">
                {['Members', 'Contributions', 'Loans', 'Welfare', 'Reports'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-sidebar-foreground/60 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Features', 'Pricing', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-sidebar-foreground/60 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>Get Started</h4>
              <div className="space-y-2">
                <Link href="/register">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">Register Now</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" variant="outline" className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
                    Member Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-sidebar-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-sidebar-foreground/50">
              © 2026 BOMAENGWE WELFARE. All rights reserved.
            </p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
                <a key={item} href="#" className="text-xs text-sidebar-foreground/50 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
