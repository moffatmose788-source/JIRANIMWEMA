/**
 * BOMAENGWE WELFARE — Committee Dashboard
 */

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'wouter';
import { Clock, CheckCircle2, XCircle, CalendarDays, Users, CreditCard, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { membersService, contributionsService, meetingsService, welfareService, type Contribution, type Meeting, type UserProfile, type WelfareRequest } from '@/lib/firestore';
import { toast } from 'sonner';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CommitteeDashboard() {
  const [welfare, setWelfare] = useState<WelfareRequest[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [welfareData, upcomingMeetings, contribs, memberList] = await Promise.all([
          welfareService.getAll(),
          meetingsService.getUpcoming(),
          contributionsService.getAll(),
          membersService.getAll(),
        ]);
        if (!mounted) return;
        setWelfare(welfareData);
        setMeetings(upcomingMeetings);
        setContributions(contribs);
        setMembers(memberList);
      } catch {
        toast.error('Failed to load dashboard data');
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const pendingWelfare = welfare.filter((w) => w.status === 'pending' || w.status === 'under_review');
  const upcomingMeetings = meetings.filter((m) => m.status === 'scheduled');
  const totalContributions = contributions.reduce((s, c) => s + c.amount, 0);

  const monthlyCollections = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return MONTHS.map((month, index) => ({
      month,
      amount: contributions
        .filter((c) => {
          const date = new Date(c.paymentDate as Date);
          return date.getMonth() === index && date.getFullYear() === currentYear;
        })
        .reduce((sum, c) => sum + c.amount, 0),
    }));
  }, [contributions]);

  return (
    <DashboardLayout title="Committee Dashboard" subtitle="Review and approve requests">
      <div className="p-4 sm:p-6 space-y-6">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white"
        >
          <p className="text-sm text-white/70 mb-1">Committee Member</p>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Committee Dashboard</h2>
          <p className="text-sm text-white/80 mt-1">
            {pendingWelfare.length} welfare requests pending review
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[

            { label: 'Pending Welfare', value: pendingWelfare.length, icon: HandHeart, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', href: '/welfare' },
            { label: 'Total Members', value: members.length, icon: Users, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', href: '/members' },
            { label: 'Total Contributions', value: formatCurrency(totalContributions), icon: CreditCard, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', href: '/contributions' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={stat.href}>
                  <div className="bg-card rounded-xl border border-border p-5 card-hover">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', stat.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-foreground stat-number">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Charts + tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly collections chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Monthly Collections</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyCollections}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v/1000}K`} />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Collections']} />
                <Bar dataKey="amount" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>


        </div>

        {/* Pending welfare + upcoming meetings */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Pending Welfare Requests</h3>
              <Link href="/welfare">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
              </Link>
            </div>
            {pendingWelfare.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pending welfare requests</p>
            ) : (
              <div className="space-y-3">
                {pendingWelfare.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.memberName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{req.category} · {formatCurrency(req.amount)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toast.success('Welfare request approved!')}
                        className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toast.error('Welfare request rejected')}
                        className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Upcoming Meetings</h3>
              <Link href="/meetings">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(meeting.date as Date, 'dd MMM yyyy, HH:mm')}</p>
                    <p className="text-xs text-muted-foreground">{meeting.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}
