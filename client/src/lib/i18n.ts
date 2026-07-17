/**
 * BOMAENGWE WELFARE — Internationalization
 * Supports English and Swahili
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      members: 'Members',
      contributions: 'Contributions',
      loans: 'Loans',
      welfare: 'Welfare',
      meetings: 'Meetings',
      announcements: 'Announcements',
      finances: 'Finances',
      reports: 'Reports',
      settings: 'Settings',
      notifications: 'Notifications',
      logout: 'Logout',
      profile: 'Profile',

      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      loading: 'Loading...',
      noData: 'No data found',
      confirm: 'Confirm',
      close: 'Close',
      submit: 'Submit',
      approve: 'Approve',
      reject: 'Reject',

      // Status
      pending: 'Pending',
      active: 'Active',
      inactive: 'Inactive',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      defaulted: 'Defaulted',
      disbursed: 'Disbursed',
      under_review: 'Under Review',
      scheduled: 'Scheduled',
      cancelled: 'Cancelled',

      // Auth
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      nationalId: 'National ID',

      // Landing
      heroTitle: 'Your Welfare, Managed with Care',
      heroSubtitle: 'BOMAENGWE WELFARE brings transparency, trust, and technology to your community welfare society.',
      joinCommunity: 'Join the Community',
      learnMore: 'Learn More',

      // Dashboard
      totalMembers: 'Total Members',
      activeMembers: 'Active Members',
      monthlyCollections: 'Monthly Collections',
      welfareDisbursements: 'Welfare Disbursements',
      activeLoans: 'Active Loans',
      outstandingLoans: 'Outstanding Loans',
      pendingRequests: 'Pending Requests',
      upcomingMeetings: 'Upcoming Meetings',

      // Welfare categories
      medical: 'Medical',
      funeral: 'Funeral',
      education: 'Education',
      emergency: 'Emergency Relief',
      other: 'Other',

      // Payment methods
      mpesa: 'M-Pesa',
      cash: 'Cash',
      bank_transfer: 'Bank Transfer',
      cheque: 'Cheque',
    },
  },
  sw: {
    translation: {
      // Navigation
      dashboard: 'Dashibodi',
      members: 'Wanachama',
      contributions: 'Michango',
      loans: 'Mikopo',
      welfare: 'Ustawi',
      meetings: 'Mikutano',
      announcements: 'Matangazo',
      finances: 'Fedha',
      reports: 'Ripoti',
      settings: 'Mipangilio',
      notifications: 'Arifa',
      logout: 'Toka',
      profile: 'Wasifu',

      // Common
      save: 'Hifadhi',
      cancel: 'Ghairi',
      delete: 'Futa',
      edit: 'Hariri',
      view: 'Angalia',
      add: 'Ongeza',
      search: 'Tafuta',
      filter: 'Chuja',
      export: 'Hamisha',
      loading: 'Inapakia...',
      noData: 'Hakuna data',
      confirm: 'Thibitisha',
      close: 'Funga',
      submit: 'Wasilisha',
      approve: 'Idhinisha',
      reject: 'Kataa',

      // Status
      pending: 'Inasubiri',
      active: 'Hai',
      inactive: 'Haijakuwa Hai',
      approved: 'Imeidhinishwa',
      rejected: 'Imekataliwa',
      completed: 'Imekamilika',
      defaulted: 'Imeshindwa',
      disbursed: 'Imetolewa',
      under_review: 'Inakaguliwa',
      scheduled: 'Imepangwa',
      cancelled: 'Imefutwa',

      // Auth
      login: 'Ingia',
      register: 'Jisajili',
      forgotPassword: 'Umesahau Nywila?',
      resetPassword: 'Weka Upya Nywila',
      email: 'Barua Pepe',
      password: 'Nywila',
      confirmPassword: 'Thibitisha Nywila',
      fullName: 'Jina Kamili',
      phoneNumber: 'Nambari ya Simu',
      nationalId: 'Kitambulisho cha Taifa',

      // Landing
      heroTitle: 'Ustawi Wako, Unaosimamiwa kwa Uangalifu',
      heroSubtitle: 'BOMAENGWE WELFARE inaleta uwazi, uaminifu, na teknolojia kwa chama chako cha ustawi.',
      joinCommunity: 'Jiunge na Jamii',
      learnMore: 'Jifunze Zaidi',

      // Dashboard
      totalMembers: 'Jumla ya Wanachama',
      activeMembers: 'Wanachama Hai',
      monthlyCollections: 'Makusanyo ya Mwezi',
      welfareDisbursements: 'Malipo ya Ustawi',
      activeLoans: 'Mikopo Hai',
      outstandingLoans: 'Mikopo Iliyobaki',
      pendingRequests: 'Maombi Yanayosubiri',
      upcomingMeetings: 'Mikutano Inayokuja',

      // Welfare categories
      medical: 'Matibabu',
      funeral: 'Mazishi',
      education: 'Elimu',
      emergency: 'Msaada wa Dharura',
      other: 'Nyingine',

      // Payment methods
      mpesa: 'M-Pesa',
      cash: 'Pesa Taslimu',
      bank_transfer: 'Uhamisho wa Benki',
      cheque: 'Hundi',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
