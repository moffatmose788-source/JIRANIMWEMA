import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import type { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function toDate(value: Date | Timestamp | string | undefined | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  // Firestore Timestamp
  if (typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }
  return null;
}

export function formatDate(value: Date | Timestamp | string | undefined | null, fmt = 'dd MMM yyyy'): string {
  const d = toDate(value);
  if (!d) return '—';
  try {
    return format(d, fmt);
  } catch {
    return '—';
  }
}

export function formatDateTime(value: Date | Timestamp | string | undefined | null): string {
  return formatDate(value, 'dd MMM yyyy, HH:mm');
}

export function formatRelative(value: Date | Timestamp | string | undefined | null): string {
  const d = toDate(value);
  if (!d) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getMonthName(month: number): string {
  return format(new Date(2024, month - 1, 1), 'MMMM');
}

// ─── Currency Utilities ───────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'KES'): string {
  return `${currency} ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-KE');
}

// ─── Status Utilities ─────────────────────────────────────────────────────────

export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'badge-pending',
    under_review: 'badge-pending',
    active: 'badge-active',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    completed: 'badge-completed',
    defaulted: 'badge-defaulted',
    disbursed: 'badge-disbursed',
    scheduled: 'badge-active',
    cancelled: 'badge-rejected',
    inactive: 'badge-rejected',
    suspended: 'badge-defaulted',
  };
  return map[status] || 'badge-pending';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    active: 'Active',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    defaulted: 'Defaulted',
    disbursed: 'Disbursed',
    scheduled: 'Scheduled',
    cancelled: 'Cancelled',
    inactive: 'Inactive',
    suspended: 'Suspended',
  };
  return map[status] || status;
}

// ─── Receipt Number Generator ─────────────────────────────────────────────────

export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

// ─── Member Number Generator ──────────────────────────────────────────────────

export function generateMemberNumber(index: number): string {
  return `BWS-${String(index).padStart(5, '0')}`;
}

// ─── Percentage Calculator ────────────────────────────────────────────────────

export function calcPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// ─── Trend Indicator ─────────────────────────────────────────────────────────

export function calcTrend(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

export async function exportToPDF(title: string, data: Record<string, unknown>[], columns: string[]): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(15, 118, 110); // teal
  doc.text('BOMAENGWE WELFARE', 14, 20);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 30);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 14, 38);
  
  // Table header
  let y = 50;
  const colWidth = (doc.internal.pageSize.width - 28) / columns.length;
  
  doc.setFillColor(15, 118, 110);
  doc.rect(14, y - 5, doc.internal.pageSize.width - 28, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  columns.forEach((col, i) => {
    doc.text(col, 14 + i * colWidth + 2, y);
  });
  
  // Table rows
  doc.setTextColor(0, 0, 0);
  y += 10;
  data.forEach((row, rowIdx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    if (rowIdx % 2 === 0) {
      doc.setFillColor(240, 253, 250);
      doc.rect(14, y - 5, doc.internal.pageSize.width - 28, 8, 'F');
    }
    const values = Object.values(row);
    values.forEach((val, i) => {
      if (i < columns.length) {
        doc.text(String(val ?? ''), 14 + i * colWidth + 2, y);
      }
    });
    y += 8;
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
}

// ─── Excel Export ─────────────────────────────────────────────────────────────

export async function exportToExcel(title: string, data: Record<string, unknown>[], headers: Record<string, string>): Promise<void> {
  const XLSX = await import('xlsx');
  
  const wsData = [
    Object.values(headers),
    ...data.map((row) => Object.keys(headers).map((key) => row[key] ?? '')),
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`);
}

// ─── QR Code Generator ───────────────────────────────────────────────────────

export async function generateQRCode(data: string): Promise<string> {
  const QRCode = await import('qrcode');
  return QRCode.toDataURL(data, { width: 200, margin: 1, color: { dark: '#0F766E', light: '#FFFFFF' } });
}

// ─── Truncate Text ────────────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
