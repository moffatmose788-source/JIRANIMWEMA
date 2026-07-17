/**
 * BOMAENGWE WELFARE — Contributions Page
 * Record contributions, view history, generate receipts
 */

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Search, Download, Receipt, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { cn, formatCurrency, formatDate, generateReceiptNumber, exportToExcel, exportToPDF } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { contributionsService, membersService, type Contribution, type UserProfile, type PaymentMethod } from '@/lib/firestore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

interface ContributionForm {
  memberId: string;
  amount: string;
  month: string;
  year: string;
  paymentMethod: string;
  mpesaCode: string;
  notes: string;
}

export default function ContributionsPage() {
  const { currentUser, role } = useAuth();
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ContributionForm>();

  const isAdmin = role === 'admin' || role === 'committee';

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [contribs, memberList] = await Promise.all([
          contributionsService.getAll(),
          membersService.getAll(),
        ]);
        if (!mounted) return;
        setContributions(contribs);
        setMembers(memberList);
      } catch {
        toast.error('Failed to load contribution data');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => contributions.filter((c) => {
    const matchSearch =
      c.memberName.toLowerCase().includes(search.toLowerCase()) ||
      c.receiptNumber.toLowerCase().includes(search.toLowerCase());
    const matchMonth = monthFilter === 'all' || c.month.toString() === monthFilter;
    return matchSearch && matchMonth;
  }), [contributions, search, monthFilter]);

  const totalAmount = filtered.reduce((s, c) => s + c.amount, 0);
  const mpesaTotal = filtered.filter((c) => c.paymentMethod === 'mpesa').reduce((s, c) => s + c.amount, 0);
  const cashTotal = filtered.filter((c) => c.paymentMethod === 'cash').reduce((s, c) => s + c.amount, 0);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const totalCollected = contributions.reduce((s, c) => s + c.amount, 0);
  const thisMonthAmount = contributions
    .filter((c) => c.month === currentMonth && c.year === currentYear)
    .reduce((s, c) => s + c.amount, 0);

  async function loadContributions() {
    try {
      const contribs = await contributionsService.getAll();
      setContributions(contribs);
    } catch {
      toast.error('Failed to refresh contributions');
    }
  }

  async function onRecord(data: ContributionForm) {
    setLoading(true);
    try {
      const member = members.find((m) => m.id === data.memberId);
      await contributionsService.create({
        memberId: data.memberId,
        memberName: member?.fullName || 'Unknown Member',
        amount: Number(data.amount),
        month: Number(data.month),
        year: Number(data.year),
        paymentMethod: data.paymentMethod as PaymentMethod,
        receiptNumber: generateReceiptNumber(),
        paymentDate: new Date(),
        notes: data.notes,
        recordedBy: currentUser?.email || 'system',
      });
      toast.success(`Contribution of ${formatCurrency(Number(data.amount))} recorded successfully!`);
      await loadContributions();
      setAddOpen(false);
      reset();
    } catch {
      toast.error('Failed to record contribution');
    } finally {
      setLoading(false);
    }
  }

  async function onExportContributions() {
    try {
      const rows = filtered.map((contrib) => ({
        Receipt: contrib.receiptNumber,
        Member: contrib.memberName,
        Amount: formatCurrency(contrib.amount),
        Period: `${MONTHS[contrib.month - 1]} ${contrib.year}`,
        Method: contrib.paymentMethod.replace('_', ' '),
        Date: formatDate(contrib.paymentDate as Date, 'dd MMM yyyy'),
        Notes: contrib.notes || '',
      }));
      await exportToExcel('Contributions_Report', rows, {
        Receipt: 'Receipt',
        Member: 'Member',
        Amount: 'Amount',
        Period: 'Period',
        Method: 'Payment Method',
        Date: 'Payment Date',
        Notes: 'Notes',
      });
    } catch {
      toast.error('Failed to export contributions');
    }
  }

  async function onDownloadReceipt(contrib: Contribution) {
    try {
      const row = [{
        'Receipt Number': contrib.receiptNumber,
        Member: contrib.memberName,
        Amount: formatCurrency(contrib.amount),
        Period: `${MONTHS[contrib.month - 1]} ${contrib.year}`,
        'Payment Method': contrib.paymentMethod.replace('_', ' '),
        'Payment Date': formatDate(contrib.paymentDate as Date, 'dd MMM yyyy'),
        'Recorded By': contrib.recordedBy,
        Notes: contrib.notes || '',
      }];
      await exportToPDF(`Receipt_${contrib.receiptNumber}`, row, Object.keys(row[0]));
    } catch {
      toast.error('Failed to download receipt');
    }
  }

  const paymentMethodColors: Record<string, string> = {
    mpesa: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cash: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    bank_transfer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    cheque: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <DashboardLayout title="Contributions" subtitle="Track and manage member contributions">
      <div className="p-4 sm:p-6 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Collected', value: formatCurrency(totalCollected), icon: TrendingUp, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
            { label: 'This Month', value: formatCurrency(thisMonthAmount), icon: Calendar, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: 'Via M-Pesa', value: formatCurrency(mpesaTotal), icon: CreditCard, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
            { label: 'Via Cash', value: formatCurrency(cashTotal), icon: Receipt, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
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
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', stat.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-foreground stat-number">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Payment details */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">System payment details</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the society payment details when submitting your contribution. The exact details will be provided here shortly.
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">Pay with system details</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-muted p-3">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Provider</p>
              <p className="mt-1 font-semibold text-sm">M-Pesa</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Account</p>
              <p className="mt-1 font-semibold text-sm">Coming soon</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Account name</p>
              <p className="mt-1 font-semibold text-sm">Bomaengwe Welfare Society</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">Reference</p>
              <p className="mt-1 font-semibold text-sm">Member number / receipt</p>
            </div>
          </div>
        </div>

        {/* Filters + actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by member or receipt..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={(i + 1).toString()}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={onExportContributions} className="gap-1.5">
              <Download className="w-4 h-4" /> Export
            </Button>

            {isAdmin && (
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                    <Plus className="w-4 h-4" /> Record Contribution
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle style={{ fontFamily: 'Sora, sans-serif' }}>Record Contribution</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onRecord)} className="space-y-4 mt-2">
                    <div>
                      <Label className="text-xs font-medium">Member *</Label>
                      <Select onValueChange={(v) => setValue('memberId', v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((m) => (
                            <SelectItem key={m.id!} value={m.id!}>{m.fullName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium">Amount (KES) *</Label>
                        <Input className="mt-1" type="number" placeholder="500" {...register('amount', { required: true })} />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Payment Method *</Label>
                        <Select onValueChange={(v) => setValue('paymentMethod', v)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Month *</Label>
                        <Select onValueChange={(v) => setValue('month', v)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map((m, i) => (
                              <SelectItem key={m} value={(i + 1).toString()}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Year *</Label>
                        <Input className="mt-1" type="number" placeholder="2026" defaultValue="2026" {...register('year', { required: true })} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">M-Pesa Code / Reference</Label>
                      <Input className="mt-1" placeholder="QHX7XXXXXX" {...register('mpesaCode')} />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Notes</Label>
                      <Input className="mt-1" placeholder="Optional notes" {...register('notes')} />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                        {loading ? 'Recording...' : 'Record Contribution'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-xs">Receipt</TableHead>
                  <TableHead className="font-semibold text-xs">Member</TableHead>
                  <TableHead className="font-semibold text-xs">Amount</TableHead>
                  <TableHead className="font-semibold text-xs">Period</TableHead>
                  <TableHead className="font-semibold text-xs">Method</TableHead>
                  <TableHead className="font-semibold text-xs">Date</TableHead>
                  <TableHead className="font-semibold text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((contrib, i) => (
                  <motion.tr
                    key={contrib.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{contrib.receiptNumber}</TableCell>
                    <TableCell className="font-medium text-sm">{contrib.memberName}</TableCell>
                    <TableCell className="font-semibold text-sm stat-number">{formatCurrency(contrib.amount)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {MONTHS[contrib.month - 1]} {contrib.year}
                    </TableCell>
                    <TableCell>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', paymentMethodColors[contrib.paymentMethod] || '')}>
                        {contrib.paymentMethod.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(contrib.paymentDate as Date, 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => onDownloadReceipt(contrib)}
                      >
                        <Receipt className="w-3 h-3" /> Receipt
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No contributions found</p>
            </div>
          )}

          {/* Footer total */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 bg-muted/30 border-t border-border flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{filtered.length} records</span>
              <span className="text-sm font-semibold text-foreground">
                Total: <span className="stat-number">{formatCurrency(totalAmount)}</span>
              </span>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
