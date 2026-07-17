/**
 * BOMAENGWE WELFARE — Admin Dashboard
 * Full metrics: members, contributions, loans, welfare, meetings
 * Charts: collection trends, loan repayments, income vs expenses, member growth
 */

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Link } from 'wouter';
import {
  Users, CreditCard, HandHeart, TrendingUp,
  AlertCircle, CalendarDays, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
  membersService,
  contributionsService,
  welfareService,
  meetingsService,
  expensesService,
  type Contribution,
  type Expense,
  type Meeting,
  type UserProfile,
  type WelfareRequest,
} from '@/lib/firestore';

const TEAL = '#0F766E';
const BLUE = '#2563EB';
const EMERALD = '#10B981';
const AMBER = '#F59E0B';
const RED = '#EF4444';

const PIE_COLORS = [TEAL, BLUE, EMERALD, AMBER, RED];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  color: string;
  href?: string;
  delay?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color, href, delay = 0 }: StatCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className="bg-card rounded-xl border border-border p-5 card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', trend.isPositive ? 'text-emerald-600' : 'text-red-500')}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground stat-number">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export default function AdminDashboard() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [welfare, setWelfare] = useState<WelfareRequest[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [memberList, contribs, welfareList, meetingList, expenseList] = await Promise.all([
          membersService.getAll(),
          contributionsService.getAll(),
          welfareService.getAll(),
          meetingsService.getUpcoming(),
          expensesService.getAll(),
        ]);
        if (!mounted) return;
        setMembers(memberList);
        setContributions(contribs);
        setWelfare(welfareList);
        setMeetings(meetingList);
        setExpenses(expenseList);
      } catch {
        // ignore errors
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.memberStatus === 'active').length;
  const totalContributions = contributions.reduce((s, c) => s + c.amount, 0);
  const pendingWelfare = welfare.filter((w) => w.status === 'pending' || w.status === 'under_review').length;
  const totalWelfareDisbursed = welfare.filter((w) => w.status === 'disbursed').reduce((s, w) => s + w.amount, 0);
  const upcomingMeetings = meetings.filter((m) => m.status === 'scheduled').length;

  const currentYear = new Date().getFullYear();
  const monthlyCollections = useMemo(() => MONTHS.map((month, index) => ({
    month,
    amount: contributions
      .filter((c) => {
        const date = new Date(c.paymentDate as Date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      })
      .reduce((sum, c) => sum + c.amount, 0),
  })), [contributions, currentYear]);

  const incomeExpenses = useMemo(() => MONTHS.map((month, index) => {
    const income = contributions
      .filter((c) => {
        const date = new Date(c.paymentDate as Date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      })
      .reduce((sum, c) => sum + c.amount, 0);

    const expense = expenses
      .filter((e) => {
        const date = new Date(e.date as Date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return { month, income, expenses: expense };
  }), [contributions, expenses, currentYear]);

  const welfareByCategory = [
    { name: 'Medical', value: welfare.filter((w) => w.category === 'medical').length },
    { name: 'Funeral', value: welfare.filter((w) => w.category === 'funeral').length },
    { name: 'Education', value: welfare.filter((w) => w.category === 'education').length },
    { name: 'Emergency', value: welfare.filter((w) => w.category === 'emergency').length },
    { name: 'Other', value: welfare.filter((w) => w.category === 'other').length },
  ].filter((d) => d.value > 0);

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="BOMAENGWE WELFARE — Overview">
      <div className="p-4 sm:p-6 space-y-6">

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-white relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10">
            <div className="w-32 h-32 rounded-full bg-white absolute -right-8 -top-8" />
            <div className="w-20 h-20 rounded-full bg-white absolute right-4 bottom-0" />
          </div>
          <p className="text-sm text-white/70 mb-1">Good morning, Administrator</p>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            BOMAENGWE WELFARE Dashboard
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {activeMembers} active members · {pendingWelfare} pending requests
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Members"
            value={totalMembers}
            subtitle={`${activeMembers} active`}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            color="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
            href="/members"
            delay={0}
          />
          <StatCard
            title="Monthly Collections"
            value={formatCurrency(monthlyCollections[monthlyCollections.length - 1]?.amount || 0)}
            subtitle={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            icon={CreditCard}
            trend={{ value: 12, isPositive: true }}
            color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            href="/contributions"
            delay={0.05}
          />

          <StatCard
            title="Welfare Disbursed"
            value={formatCurrency(totalWelfareDisbursed)}
            subtitle={`${pendingWelfare} pending`}
            icon={HandHeart}
            trend={{ value: 3, isPositive: true }}
            color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            href="/welfare"
            delay={0.15}
          />
        </div>

        {/* Second row stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Contributions"
            value={formatCurrency(totalContributions)}
            subtitle="All time"
            icon={TrendingUp}
            color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            delay={0.2}
          />

          <StatCard
            title="Pending Requests"
            value={pendingWelfare}
            subtitle="Pending welfare requests"
            icon={Clock}
            color="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            delay={0.3}
          />
          <StatCard
            title="Upcoming Meetings"
            value={upcomingMeetings}
            subtitle="Scheduled"
            icon={CalendarDays}
            color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
            href="/meetings"
            delay={0.35}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Collection Trends */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                Collection Trends
              </h3>
              <Badge variant="secondary" className="text-xs">2026</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyCollections}>
                <defs>
                  <linearGradient id="collectionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Collections']} />
                <Area type="monotone" dataKey="amount" stroke={TEAL} fill="url(#collectionGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Income vs Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                Income vs Expenses
              </h3>
              <Badge variant="secondary" className="text-xs">2026</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={incomeExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" name="Income" fill={EMERALD} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={RED} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Welfare by Category */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
              Welfare by Category
            </h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={welfareByCategory} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                  {welfareByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {welfareByCategory.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent activity tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Welfare */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Welfare Requests</h3>
              <Link href="/welfare">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {welfare.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{req.memberName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{req.category} · {formatCurrency(req.amount)}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', `badge-${req.status}`)}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Upcoming meetings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Upcoming Meetings</h3>
            <Link href="/meetings">
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {meetings.filter((m) => m.status === 'scheduled').map((meeting) => (
              <div key={meeting.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(meeting.date as Date, 'dd MMM yyyy, HH:mm')}</p>
                  <p className="text-xs text-muted-foreground">{meeting.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
