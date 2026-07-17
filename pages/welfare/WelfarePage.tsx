/**
 * BOMAENGWE WELFARE — Welfare Assistance Page
 * Submit requests, track status, approve/reject (committee/admin)
 */

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  HandHeart, Plus, Search, CheckCircle2, XCircle, Clock, Eye,
  HeartPulse, GraduationCap, Cross, AlertTriangle, MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { MOCK_WELFARE } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface WelfareForm {
  category: string;
  amount: string;
  description: string;
  supportingDocuments: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  medical: HeartPulse,
  education: GraduationCap,
  funeral: Cross,
  emergency: AlertTriangle,
  other: HandHeart,
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Eye },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
  disbursed: { label: 'Disbursed', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', icon: CheckCircle2 },
};

export default function WelfarePage() {
  const { role, userProfile } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [applyOpen, setApplyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<WelfareForm>();

  const isAdmin = role === 'admin' || role === 'committee';

  const filtered = MOCK_WELFARE.filter((w) => {
    const matchSearch = w.memberName.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || w.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalDisbursed = MOCK_WELFARE.filter((w) => w.status === 'disbursed').reduce((s, w) => s + w.amount, 0);
  const pendingCount = MOCK_WELFARE.filter((w) => w.status === 'pending' || w.status === 'under_review').length;

  async function onApply(data: WelfareForm) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Welfare request submitted successfully! You will be notified when it is reviewed.');
    setLoading(false);
    setApplyOpen(false);
    reset();
  }

  return (
    <DashboardLayout title="Welfare Assistance" subtitle="Community welfare support program">
      <div className="p-4 sm:p-6 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Requests', value: MOCK_WELFARE.length, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
            { label: 'Pending Review', value: pendingCount, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
            { label: 'Approved', value: MOCK_WELFARE.filter((w) => w.status === 'approved' || w.status === 'disbursed').length, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
            { label: 'Total Disbursed', value: formatCurrency(totalDisbursed), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', stat.color)}>
                <HandHeart className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-foreground stat-number">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters + actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="funeral">Funeral</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                  <Plus className="w-4 h-4" /> Apply for Welfare
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Sora, sans-serif' }}>Apply for Welfare Assistance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onApply)} className="space-y-4 mt-2">
                  <div>
                    <Label className="text-xs font-medium">Category *</Label>
                    <Select onValueChange={(v) => setValue('category', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="funeral">Funeral</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Amount Requested (KES) *</Label>
                    <Input
                      className="mt-1"
                      type="number"
                      placeholder="10000"
                      {...register('amount', { required: 'Amount is required' })}
                    />
                    {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Description *</Label>
                    <Textarea
                      className="mt-1"
                      rows={3}
                      placeholder="Describe your welfare need in detail..."
                      {...register('description', { required: 'Description is required' })}
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Supporting Documents</Label>
                    <Input
                      className="mt-1"
                      placeholder="List document names (e.g., Hospital receipt, Death certificate)"
                      {...register('supportingDocuments')}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Welfare cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((req, i) => {
            const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            const CategoryIcon = CATEGORY_ICONS[req.category] || HandHeart;

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-xl border border-border p-4 card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CategoryIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm capitalize">{req.category}</p>
                      <p className="text-xs text-muted-foreground">{req.memberName}</p>
                    </div>
                  </div>
                  {isAdmin && (req.status === 'pending' || req.status === 'under_review') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.success('Welfare request approved!')}>
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.error('Welfare request rejected')}>
                          <XCircle className="w-4 h-4 mr-2 text-red-600" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{req.description}</p>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground stat-number">{formatCurrency(req.amount)}</p>
                  <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Applied {formatDate(req.applicationDate as Date, 'dd MMM yyyy')}
                </p>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <HandHeart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No welfare requests found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
