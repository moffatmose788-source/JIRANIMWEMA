/**
 * BOMAENGWE WELFARE — Member Dashboard
 */

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'wouter';
import { CreditCard, HandHeart, CalendarDays, Megaphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { announcementsService, contributionsService, meetingsService, welfareService, type Announcement, type Contribution, type Meeting, type WelfareRequest } from '@/lib/firestore';

export default function MemberDashboard() {
  const { userProfile, role } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [welfareRequests, setWelfareRequests] = useState<WelfareRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!userProfile?.id) return;
      try {
        const [memberContribs, memberWelfare, allAnnouncements, upcomingMeetings] = await Promise.all([
          contributionsService.getByMember(userProfile.id),
          welfareService.getByMember(userProfile.id),
          announcementsService.getAll(),
          meetingsService.getUpcoming(),
        ]);

        if (!mounted) return;

        setContributions(memberContribs);
        setWelfareRequests(memberWelfare);
        setAnnouncements(allAnnouncements);
        setMeetings(upcomingMeetings);
      } catch {
        // ignore load failures
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [userProfile?.id]);

  const myContributions = contributions;
  const myWelfare = welfareRequests;
  const totalContributed = myContributions.reduce((s, c) => s + c.amount, 0);

  // Contribution history for chart
  const contribHistory = myContributions.slice(0, 6).reverse().map((c) => ({
    month: `${c.month}/${c.year}`,
    amount: c.amount,
  }));

  const visibleAnnouncements = announcements.filter((ann) =>
    ann.targetRole === 'all' || ann.targetRole === role
  );

  return (
    <DashboardLayout title="My Dashboard" subtitle={`Welcome, ${userProfile?.fullName?.split(' ')[0] || 'Member'}`}>
      <div className="p-4 sm:p-6 space-y-6">

        {/* Welcome card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-5 text-white relative overflow-hidden"
        >
          <div className="absolute right-4 top-4 opacity-10">
            <div className="w-24 h-24 rounded-full border-4 border-white" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/70">Member #{userProfile?.memberNumber}</p>
              <h2 className="text-xl font-bold mt-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                {userProfile?.fullName || 'Member'}
              </h2>
              <p className="text-sm text-white/80 mt-1">{userProfile?.village} · {userProfile?.occupation}</p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              {userProfile?.memberStatus === 'active' ? '✓ Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-white/60">Total Contributed</p>
              <p className="text-lg font-bold stat-number">{formatCurrency(totalContributed)}</p>
            </div>

            <div>
              <p className="text-xs text-white/60">Welfare Requests</p>
              <p className="text-lg font-bold stat-number">{myWelfare.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'My Contributions', href: '/contributions', icon: CreditCard, color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' },

            { label: 'Request Welfare', href: '/welfare', icon: HandHeart, color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
            { label: 'View Meetings', href: '/meetings', icon: CalendarDays, color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={action.href}>
                  <div className="bg-card rounded-xl border border-border p-4 card-hover text-center">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2', action.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-foreground">{action.label}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Contribution chart */}
        {contribHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>My Contribution History</h3>
              <Link href="/contributions">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={contribHistory}>
                <defs>
                  <linearGradient id="memberContrib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`KES ${v}`, 'Amount']} />
                <Area type="monotone" dataKey="amount" stroke="#0F766E" fill="url(#memberContrib)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* My welfare */}
        <div className="grid lg:grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>My Welfare Requests</h3>
              <Link href="/welfare">
                <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
              </Link>
            </div>
            {myWelfare.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">No welfare requests</p>
                <Link href="/welfare">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Submit Request</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myWelfare.map((req) => (
                  <div key={req.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground capitalize">{req.category}</p>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', `badge-${req.status}`)}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                    <p className="text-xs font-medium text-foreground mt-1">{formatCurrency(req.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Latest Announcements</h3>
            <Link href="/announcements">
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {visibleAnnouncements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{ann.title}</p>
                    {ann.isPinned && <Badge className="text-xs bg-primary/10 text-primary border-primary/20 h-4 px-1">Pinned</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming meetings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Upcoming Meetings</h3>
            <Link href="/meetings">
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {meetings.filter((m) => m.status === 'scheduled').map((meeting) => (
              <div key={meeting.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(meeting.date as Date, 'dd MMM yyyy, HH:mm')} · {meeting.venue}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
