/**
 * BOMAENGWE WELFARE — Financial Management Page
 * Income, expenses, balance sheet, charts
 */

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, Plus, Download, DollarSign,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { MOCK_CONTRIBUTIONS, MOCK_EXPENSES } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface ExpenseForm {
  description: string;
  amount: string;
  category: string;
  paymentMethod: string;
  receiptNumber: string;
  notes: string;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Build monthly income vs expense chart data
const monthlyData = MONTHS_SHORT.map((month, idx) => {
  const income = MOCK_CONTRIBUTIONS.filter((c) => c.month === idx + 1 && c.year === 2026)
    .reduce((s, c) => s + c.amount, 0);
  const expenses = MOCK_EXPENSES.filter((e) => {
    const d = e.date as Date;
    return d.getMonth() === idx && d.getFullYear() === 2026;
  }).reduce((s, e) => s + e.amount, 0);
  return { month, income, expenses, net: income - expenses };
});

const PIE_COLORS = ['#0F766E', '#0891B2', '#7C3AED', '#D97706', '#DC2626'];

const expenseByCategory = Object.entries(
  MOCK_EXPENSES.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>)
).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

export default function FinancesPage() {
  const { role } = useAuth();
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<ExpenseForm>();

  const isAdmin = role === 'admin' || role === 'committee';

  const totalIncome = MOCK_CONTRIBUTIONS.reduce((s, c) => s + c.amount, 0);
  const totalExpenses = MOCK_EXPENSES.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  async function onAddExpense(data: ExpenseForm) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(`Expense of ${formatCurrency(Number(data.amount))} recorded!`);
    setLoading(false);
    setAddExpenseOpen(false);
    reset();
  }

  return (
    <DashboardLayout title="Financial Management" subtitle="Income, expenses, and balance sheet">
      <div className="p-4 sm:p-6 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Income', value: formatCurrency(totalIncome), icon: TrendingUp, change: '+12%', positive: true, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
            { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: TrendingDown, change: '+5%', positive: false, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
            { label: 'Net Balance', value: formatCurrency(balance), icon: Wallet, change: balance > 0 ? 'Surplus' : 'Deficit', positive: balance > 0, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1 stat-number">{stat.value}</p>
                  </div>
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', stat.positive ? 'text-emerald-600' : 'text-red-600')}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change} from last period
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => toast.info('Export coming soon')} className="gap-1.5">
            <Download className="w-4 h-4" /> Export Report
          </Button>
          {isAdmin && (
            <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                  <Plus className="w-4 h-4" /> Record Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Sora, sans-serif' }}>Record Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAddExpense)} className="space-y-4 mt-2">
                  <div>
                    <Label className="text-xs font-medium">Description *</Label>
                    <Input className="mt-1" placeholder="Office supplies" {...register('description', { required: true })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium">Amount (KES) *</Label>
                      <Input type="number" className="mt-1" placeholder="1000" {...register('amount', { required: true })} />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Category *</Label>
                      <Select onValueChange={(v) => setValue('category', v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="welfare_support">Welfare Support</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Payment Method</Label>
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
                      <Label className="text-xs font-medium">Receipt Number</Label>
                      <Input className="mt-1" placeholder="RCP001" {...register('receiptNumber')} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" onClick={() => setAddExpenseOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? 'Recording...' : 'Record Expense'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Charts + Tables */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Monthly chart */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-4 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
                Monthly Income vs Expenses (2026)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="income" stroke="#0F766E" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="#DC2626" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Expense breakdown pie */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-4 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Expense Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={expenseByCategory} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {expenseByCategory.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold text-foreground mb-4 text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Balance Sheet Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Contributions', value: totalIncome, positive: true },
                    { label: 'Total Expenses', value: totalExpenses, positive: false },
                    { label: 'Loan Portfolio', value: 70000, positive: true },
                    { label: 'Welfare Disbursed', value: 35000, positive: false },
                    { label: 'Net Position', value: balance, positive: balance > 0, bold: true },
                  ].map((item) => (
                    <div key={item.label} className={cn('flex justify-between items-center', item.bold && 'border-t border-border pt-3')}>
                      <span className={cn('text-sm', item.bold ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{item.label}</span>
                      <span className={cn('text-sm font-semibold stat-number', item.positive ? 'text-emerald-600' : 'text-red-600')}>
                        {item.positive ? '+' : '-'}{formatCurrency(Math.abs(item.value))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="income" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold">Receipt</TableHead>
                      <TableHead className="text-xs font-semibold">Member</TableHead>
                      <TableHead className="text-xs font-semibold">Amount</TableHead>
                      <TableHead className="text-xs font-semibold">Method</TableHead>
                      <TableHead className="text-xs font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_CONTRIBUTIONS.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-xs text-muted-foreground">{c.receiptNumber}</TableCell>
                        <TableCell className="text-sm font-medium">{c.memberName}</TableCell>
                        <TableCell className="text-sm font-semibold text-emerald-600 stat-number">+{formatCurrency(c.amount)}</TableCell>
                        <TableCell className="text-xs capitalize text-muted-foreground">{c.paymentMethod.replace('_', ' ')}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(c.paymentDate as Date, 'dd MMM yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="mt-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs font-semibold">Description</TableHead>
                      <TableHead className="text-xs font-semibold">Category</TableHead>
                      <TableHead className="text-xs font-semibold">Amount</TableHead>
                      <TableHead className="text-xs font-semibold">Method</TableHead>
                      <TableHead className="text-xs font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_EXPENSES.map((e) => (
                      <TableRow key={e.id} className="hover:bg-muted/30">
                        <TableCell className="text-sm font-medium">{e.description}</TableCell>
                        <TableCell className="text-xs capitalize text-muted-foreground">{e.category.replace('_', ' ')}</TableCell>
                        <TableCell className="text-sm font-semibold text-red-600 stat-number">-{formatCurrency(e.amount)}</TableCell>
                        <TableCell className="text-xs capitalize text-muted-foreground">{e.paymentMethod.replace('_', ' ')}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(e.date as Date, 'dd MMM yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
