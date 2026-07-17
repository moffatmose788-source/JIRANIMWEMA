/**
 * BOMAENGWE WELFARE — Firestore Service Layer
 * Provides typed CRUD operations for all collections
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Collection Names ────────────────────────────────────────────────────────
export const COLLECTIONS = {
  USERS: 'users',
  CONTRIBUTIONS: 'contributions',
  LOANS: 'loans',
  LOAN_REPAYMENTS: 'loan_repayments',
  WELFARE_REQUESTS: 'welfare_requests',
  MEETINGS: 'meetings',
  ATTENDANCE: 'attendance',
  ANNOUNCEMENTS: 'announcements',
  EXPENSES: 'expenses',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs',
  SETTINGS: 'settings',
} as const;

// ─── Type Definitions ─────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'committee' | 'member';
export type MemberStatus = 'active' | 'inactive' | 'suspended';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
export type WelfareStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
export type WelfareCategory = 'medical' | 'funeral' | 'education' | 'emergency' | 'other';
export type PaymentMethod = 'mpesa' | 'cash' | 'bank_transfer' | 'cheque';

export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  occupation: string;
  village: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  memberStatus: MemberStatus;
  role: UserRole;
  memberNumber: string;
  photoURL?: string;
  dateOfBirth?: string;
  registrationDate: Timestamp | Date;
  emailVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Contribution {
  id?: string;
  memberId: string;
  memberName: string;
  amount: number;
  month: number;
  year: number;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  paymentDate: Timestamp | Date;
  notes?: string;
  recordedBy: string;
  createdAt?: Timestamp;
}

export interface Loan {
  id?: string;
  memberId: string;
  memberName: string;
  amount: number;
  interestRate: number;
  repaymentPeriod: number; // months
  monthlyInstallment: number;
  outstandingBalance: number;
  disbursedAmount?: number;
  status: LoanStatus;
  applicationDate: Timestamp | Date;
  approvalDate?: Timestamp | Date;
  disbursementDate?: Timestamp | Date;
  completionDate?: Timestamp | Date;
  purpose: string;
  approvedBy?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface LoanRepayment {
  id?: string;
  loanId: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentDate: Timestamp | Date;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  balance: number;
  penalty?: number;
  recordedBy: string;
  createdAt?: Timestamp;
}

export interface WelfareRequest {
  id?: string;
  memberId: string;
  memberName: string;
  category: WelfareCategory;
  amount: number;
  description: string;
  status: WelfareStatus;
  documents?: string[];
  applicationDate: Timestamp | Date;
  reviewDate?: Timestamp | Date;
  approvalDate?: Timestamp | Date;
  disbursementDate?: Timestamp | Date;
  reviewedBy?: string;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Meeting {
  id?: string;
  title: string;
  date: Timestamp | Date;
  venue: string;
  agenda: string;
  minutes?: string;
  actionItems?: string[];
  attendees?: string[];
  attendanceCount?: number;
  type?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed';
  organizer: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  isPinned: boolean;
  targetRole?: UserRole | 'all';
  createdBy: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Expense {
  id?: string;
  description: string;
  amount: number;
  category: 'administration' | 'welfare_support' | 'events' | 'transport' | 'miscellaneous';
  date: Timestamp | Date;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  approvedBy: string;
  recordedBy: string;
  notes?: string;
  createdAt?: Timestamp;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'contribution' | 'loan' | 'welfare' | 'meeting' | 'announcement' | 'general';
  isRead: boolean;
  createdAt?: Timestamp;
}

export interface AuditLog {
  id?: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp: Timestamp;
}

// ─── Generic CRUD Helpers ─────────────────────────────────────────────────────

export async function createDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T
): Promise<string> {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getDocument<T>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function updateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const ref = doc(db, collectionName, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  const ref = doc(db, collectionName, id);
  await deleteDoc(ref);
}

export async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

// ─── Specific Service Functions ───────────────────────────────────────────────

// Members
export const membersService = {
  getAll: () => queryDocuments<UserProfile>(COLLECTIONS.USERS, [orderBy('fullName')]),
  getById: (id: string) => getDocument<UserProfile>(COLLECTIONS.USERS, id),
  getByUid: async (uid: string): Promise<UserProfile | null> => {
    const results = await queryDocuments<UserProfile>(COLLECTIONS.USERS, [
      where('uid', '==', uid),
      limit(1),
    ]);
    return results[0] || null;
  },
  create: (data: Omit<UserProfile, 'id'>) =>
    createDocument(COLLECTIONS.USERS, data as Record<string, unknown>),
  update: (id: string, data: Partial<UserProfile>) =>
    updateDocument(COLLECTIONS.USERS, id, data as Record<string, unknown>),
  delete: (id: string) => deleteDocument(COLLECTIONS.USERS, id),
  getActive: () =>
    queryDocuments<UserProfile>(COLLECTIONS.USERS, [
      where('memberStatus', '==', 'active'),
      orderBy('fullName'),
    ]),
  getByRole: (role: UserRole) =>
    queryDocuments<UserProfile>(COLLECTIONS.USERS, [
      where('role', '==', role),
      orderBy('fullName'),
    ]),
};

// Contributions
export const contributionsService = {
  getAll: () =>
    queryDocuments<Contribution>(COLLECTIONS.CONTRIBUTIONS, [
      orderBy('paymentDate', 'desc'),
    ]),
  getByMember: (memberId: string) =>
    queryDocuments<Contribution>(COLLECTIONS.CONTRIBUTIONS, [
      where('memberId', '==', memberId),
      orderBy('paymentDate', 'desc'),
    ]),
  getByMonth: (month: number, year: number) =>
    queryDocuments<Contribution>(COLLECTIONS.CONTRIBUTIONS, [
      where('month', '==', month),
      where('year', '==', year),
    ]),
  create: (data: Omit<Contribution, 'id'>) =>
    createDocument(COLLECTIONS.CONTRIBUTIONS, data as Record<string, unknown>),
  update: (id: string, data: Partial<Contribution>) =>
    updateDocument(COLLECTIONS.CONTRIBUTIONS, id, data as Record<string, unknown>),
  delete: (id: string) => deleteDocument(COLLECTIONS.CONTRIBUTIONS, id),
};

// Loans
export const loansService = {
  getAll: () =>
    queryDocuments<Loan>(COLLECTIONS.LOANS, [orderBy('applicationDate', 'desc')]),
  getByMember: (memberId: string) =>
    queryDocuments<Loan>(COLLECTIONS.LOANS, [
      where('memberId', '==', memberId),
      orderBy('applicationDate', 'desc'),
    ]),
  getPending: () =>
    queryDocuments<Loan>(COLLECTIONS.LOANS, [where('status', '==', 'pending')]),
  getActive: () =>
    queryDocuments<Loan>(COLLECTIONS.LOANS, [where('status', '==', 'active')]),
  create: (data: Omit<Loan, 'id'>) =>
    createDocument(COLLECTIONS.LOANS, data as Record<string, unknown>),
  update: (id: string, data: Partial<Loan>) =>
    updateDocument(COLLECTIONS.LOANS, id, data as Record<string, unknown>),
};

// Welfare Requests
export const welfareService = {
  getAll: () =>
    queryDocuments<WelfareRequest>(COLLECTIONS.WELFARE_REQUESTS, [
      orderBy('applicationDate', 'desc'),
    ]),
  getByMember: (memberId: string) =>
    queryDocuments<WelfareRequest>(COLLECTIONS.WELFARE_REQUESTS, [
      where('memberId', '==', memberId),
      orderBy('applicationDate', 'desc'),
    ]),
  getPending: () =>
    queryDocuments<WelfareRequest>(COLLECTIONS.WELFARE_REQUESTS, [
      where('status', 'in', ['pending', 'under_review']),
    ]),
  create: (data: Omit<WelfareRequest, 'id'>) =>
    createDocument(COLLECTIONS.WELFARE_REQUESTS, data as Record<string, unknown>),
  update: (id: string, data: Partial<WelfareRequest>) =>
    updateDocument(COLLECTIONS.WELFARE_REQUESTS, id, data as Record<string, unknown>),
};

// Meetings
export const meetingsService = {
  getAll: () =>
    queryDocuments<Meeting>(COLLECTIONS.MEETINGS, [orderBy('date', 'desc')]),
  getUpcoming: () =>
    queryDocuments<Meeting>(COLLECTIONS.MEETINGS, [
      where('status', '==', 'scheduled'),
      orderBy('date'),
    ]),
  create: (data: Omit<Meeting, 'id'>) =>
    createDocument(COLLECTIONS.MEETINGS, data as Record<string, unknown>),
  update: (id: string, data: Partial<Meeting>) =>
    updateDocument(COLLECTIONS.MEETINGS, id, data as Record<string, unknown>),
  delete: (id: string) => deleteDocument(COLLECTIONS.MEETINGS, id),
};

// Announcements
export const announcementsService = {
  getAll: () =>
    queryDocuments<Announcement>(COLLECTIONS.ANNOUNCEMENTS, [
      orderBy('isPinned', 'desc'),
      orderBy('createdAt', 'desc'),
    ]),
  create: (data: Omit<Announcement, 'id'>) =>
    createDocument(COLLECTIONS.ANNOUNCEMENTS, data as Record<string, unknown>),
  update: (id: string, data: Partial<Announcement>) =>
    updateDocument(COLLECTIONS.ANNOUNCEMENTS, id, data as Record<string, unknown>),
  delete: (id: string) => deleteDocument(COLLECTIONS.ANNOUNCEMENTS, id),
};

// Expenses
export const expensesService = {
  getAll: () =>
    queryDocuments<Expense>(COLLECTIONS.EXPENSES, [orderBy('date', 'desc')]),
  create: (data: Omit<Expense, 'id'>) =>
    createDocument(COLLECTIONS.EXPENSES, data as Record<string, unknown>),
  update: (id: string, data: Partial<Expense>) =>
    updateDocument(COLLECTIONS.EXPENSES, id, data as Record<string, unknown>),
  delete: (id: string) => deleteDocument(COLLECTIONS.EXPENSES, id),
};

// Notifications
export const notificationsService = {
  getByUser: (userId: string) =>
    queryDocuments<Notification>(COLLECTIONS.NOTIFICATIONS, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50),
    ]),
  markRead: (id: string) =>
    updateDocument(COLLECTIONS.NOTIFICATIONS, id, { isRead: true }),
  create: (data: Omit<Notification, 'id'>) =>
    createDocument(COLLECTIONS.NOTIFICATIONS, data as Record<string, unknown>),
};

// Audit Logs
export const auditService = {
  log: (data: Omit<AuditLog, 'id'>) =>
    createDocument(COLLECTIONS.AUDIT_LOGS, data as Record<string, unknown>),
  getAll: () =>
    queryDocuments<AuditLog>(COLLECTIONS.AUDIT_LOGS, [
      orderBy('timestamp', 'desc'),
      limit(100),
    ]),
};

// ─── Loan Amortization Calculator ─────────────────────────────────────────────

export function calculateLoanAmortization(
  principal: number,
  annualRate: number,
  months: number
): {
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
} {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyInstallment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const schedule = [];
  let balance = principal;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyInstallment - interest;
    balance -= principalPaid;

    schedule.push({
      month: i,
      payment: Math.round(monthlyInstallment * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
    });
  }

  return {
    monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
    totalPayment: Math.round(monthlyInstallment * months * 100) / 100,
    totalInterest: Math.round((monthlyInstallment * months - principal) * 100) / 100,
    schedule,
  };
}

export { Timestamp, serverTimestamp, where, orderBy, limit, onSnapshot, query, collection, doc };
