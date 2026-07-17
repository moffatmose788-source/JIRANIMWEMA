/**
 * BOMAENGWE WELFARE — Reports Page
 * Generate and download various society reports
 */

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import {
  FileText, Download, TrendingUp, Users, HandHeart,
  Calendar, DollarSign, BarChart2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { exportToExcel, exportToPDF, formatDate } from '@/lib/utils';
import { membersService, contributionsService, welfareService, meetingsService, type UserProfile, type Contribution, type WelfareRequest, type Meeting } from '@/lib/firestore';
import { toast } from 'sonner';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const PIE_COLORS = ['#0F766E', '#0891B2', '#7C3AED', '#D97706', '#DC2626'];

const REPORT_TYPES = [
  {
    title: 'Member Report',
    description: 'Complete list of all members with status and contact information',
    icon: Users,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
  {
    title: 'Contribution Report',
    description: 'Monthly contribution summary with payment methods and totals',
    icon: DollarSign,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },

  {
    title: 'Welfare Report',
    description: 'Welfare requests, approvals, and disbursement summary',
    icon: HandHeart,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'Financial Report',
    description: 'Income, expenses, and balance sheet for the period',
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    title: 'Meeting Report',
    description: 'Meeting attendance, minutes, and action items summary',
    icon: Calendar,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
];

export default function ReportsPage() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [welfareCases, setWelfareCases] = useState<WelfareRequest[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCounts() {
      try {
        const [memberItems, contribItems, welfareItems, meetingItems] = await Promise.all([
          membersService.getAll(),
          contributionsService.getAll(),
          welfareService.getAll(),
          meetingsService.getUpcoming(),
        ]);
        if (!mounted) return;
        setMembers(memberItems);
        setContributions(contribItems);
        setWelfareCases(welfareItems);
        setMeetings(meetingItems);
      } catch {
        toast.error('Failed to load report data');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCounts();
    return () => {
      mounted = false;
    };
  }, []);

  const currentYear = new Date().getFullYear();
  const reportContributionData = useMemo(
    () => MONTHS_SHORT.map((month, idx) => ({
      month,
      amount: contributions.filter((c) => c.month === idx + 1 && c.year === currentYear).reduce((s, c) => s + c.amount, 0),
    })),
    [contributions, currentYear]
  );

  const memberStatus = useMemo(
    () => [
      { name: 'Active', value: members.filter((m) => m.memberStatus === 'active').length },
      { name: 'Inactive', value: members.filter((m) => m.memberStatus === 'inactive').length },
      { name: 'Suspended', value: members.filter((m) => m.memberStatus === 'suspended').length },
    ],
    [members]
  );

  const totalMemberCount = members.length;
  const totalContributions = contributions.reduce((s, c) => s + c.amount, 0);
  const totalWelfare = welfareCases.length;

  async function exportReportPDF(reportTitle: string) {
    try {
      switch (reportTitle) {
        case 'Member Report': {
          const rows = members.map((member) => ({
            Name: member.fullName,
            Email: member.email,
            Role: member.role,
            Status: member.memberStatus,
            'Member No.': member.memberNumber,
          }));
          await exportToPDF(reportTitle, rows, ['Name', 'Email', 'Role', 'Status', 'Member No.']);
          break;
        }
        case 'Contribution Report': {
          const rows = reportContributionData.map((row) => ({ Month: row.month, Amount: formatCurrency(row.amount) }));
          await exportToPDF(reportTitle, rows, ['Month', 'Amount']);
          break;
        }
        case 'Welfare Report': {
          const rows = welfareCases.map((item) => ({
            Member: item.memberName,
            Category: item.category,
            Amount: formatCurrency(item.amount),
            Status: item.status,
            Applied: formatDate(item.applicationDate, 'dd MMM yyyy'),
          }));
          await exportToPDF(reportTitle, rows, ['Member', 'Category', 'Amount', 'Status', 'Applied']);
          break;
        }
        case 'Financial Report': {
          const rows = [
            { Metric: 'Total Members', Value: members.length },
            { Metric: 'Total Contributions', Value: formatCurrency(totalContributions) },
            { Metric: 'Welfare Requests', Value: totalWelfare },
          ];
          await exportToPDF(reportTitle, rows, ['Metric', 'Value']);
          break;
        }
        case 'Meeting Report': {
          const rows = meetings.map((meeting) => ({
            Title: meeting.title,
            Date: formatDate(meeting.date, 'dd MMM yyyy'),
            Venue: meeting.venue,
            Status: meeting.status,
          }));
          await exportToPDF(reportTitle, rows, ['Title', 'Date', 'Venue', 'Status']);
          break;
        }
        default:
          throw new Error('Unknown report type');
      }
    } catch {
      toast.error(`Failed to export ${reportTitle} PDF`);
    }
  }

  async function exportReportExcel(reportTitle: string) {
    try {
      switch (reportTitle) {
        case 'Member Report': {
          const rows = members.map((member) => ({
            Name: member.fullName,
            Email: member.email,
            Role: member.role,
            Status: member.memberStatus,
            'Member No.': member.memberNumber,
          }));
          await exportToExcel(reportTitle, rows, {
            Name: 'Name',
            Email: 'Email',
            Role: 'Role',
            Status: 'Status',
            'Member No.': 'Member Number',
          });
          break;
        }
        case 'Contribution Report': {
          const rows = reportContributionData.map((row) => ({ Month: row.month, Amount: formatCurrency(row.amount) }));
          await exportToExcel(reportTitle, rows, { Month: 'Month', Amount: 'Amount' });
          break;
        }
        case 'Welfare Report': {
          const rows = welfareCases.map((item) => ({
            Member: item.memberName,
            Category: item.category,
            Amount: formatCurrency(item.amount),
            Status: item.status,
            Applied: formatDate(item.applicationDate, 'dd MMM yyyy'),
          }));
          await exportToExcel(reportTitle, rows, {
            Member: 'Member',
            Category: 'Category',
            Amount: 'Amount',
            Status: 'Status',
            Applied: 'Application Date',
          });
          break;
        }
        case 'Financial Report': {
          const rows = [
            { Metric: 'Total Members', Value: members.length },
            { Metric: 'Total Contributions', Value: formatCurrency(totalContributions) },
            { Metric: 'Welfare Requests', Value: totalWelfare },
          ];
          await exportToExcel(reportTitle, rows, { Metric: 'Metric', Value: 'Value' });
          break;
        }
        case 'Meeting Report': {
          const rows = meetings.map((meeting) => ({
            Title: meeting.title,
            Date: formatDate(meeting.date, 'dd MMM yyyy'),
            Venue: meeting.venue,
            Status: meeting.status,
          }));
          await exportToExcel(reportTitle, rows, {
            Title: 'Title',
            Date: 'Date',
            Venue: 'Venue',
            Status: 'Status',
          });
          break;
        }
        default:
          throw new Error('Unknown report type');
      }
    } catch {
      toast.error(`Failed to export ${reportTitle} Excel`);
    }
  }

  return (
    <DashboardLayout title="Reports" subtitle="Generate and download society reports">
      <div className="p-4 sm:p-6 space-y-6">

        {/* KPI Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: totalMemberCount, icon: Users },
            { label: 'Total Contributions', value: formatCurrency(totalContributions), icon: DollarSign },
            { label: 'Welfare Cases', value: totalWelfare, icon: HandHeart },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xl font-bold text-foreground stat-number">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Contribution trend */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
              Contribution Trend (Jan–Jun 2026)
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={reportContributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="amount" fill="#0F766E" radius={[4, 4, 0, 0]} name="Contributions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Member status pie */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
              Member Status
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={memberStatus} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                  {memberStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Report generation cards */}
        <div>
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Generate Reports
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TYPES.map((report, i) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-card rounded-xl border border-border p-4 card-hover"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{report.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-xs h-8"
                      onClick={() => exportReportPDF(report.title)}
                    >
                      <Download className="w-3 h-3" /> PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5 text-xs h-8"
                      onClick={() => exportReportExcel(report.title)}
                    >
                      <FileText className="w-3 h-3" /> Excel
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
