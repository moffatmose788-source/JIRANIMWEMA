/**
 * BOMAENGWE WELFARE — Notifications Page
 */

import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Landmark, HandHeart, CalendarDays, Megaphone, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Contribution Recorded', message: 'Your June 2026 contribution of KES 500 has been recorded.', type: 'contribution', isRead: false, time: '2 hours ago' },
  { id: 'n2', title: 'Loan Application Update', message: 'Your loan application for KES 50,000 is under review.', type: 'loan', isRead: false, time: '1 day ago' },
  { id: 'n3', title: 'Welfare Request Approved', message: 'Your welfare request for medical assistance has been approved.', type: 'welfare', isRead: true, time: '3 days ago' },
  { id: 'n4', title: 'Meeting Reminder', message: 'Monthly General Meeting scheduled for June 25, 2026 at 10:00 AM.', type: 'meeting', isRead: true, time: '5 days ago' },
  { id: 'n5', title: 'New Announcement', message: 'AGM scheduled for July 15, 2026. All members are required to attend.', type: 'announcement', isRead: true, time: '1 week ago' },
  { id: 'n6', title: 'Contribution Reminder', message: 'Your July 2026 contribution is due in 5 days.', type: 'contribution', isRead: false, time: '1 week ago' },
];

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  contribution: DollarSign,
  loan: Landmark,
  welfare: HandHeart,
  meeting: CalendarDays,
  announcement: Megaphone,
  general: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  contribution: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  loan: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  welfare: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  meeting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  announcement: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  general: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function NotificationsPage() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout title="Notifications" subtitle="Stay updated with society activities">
      <div className="p-4 sm:p-6 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => toast.success('All notifications marked as read')}
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </Button>
        </div>

        {/* Notifications list */}
        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.map((notif, i) => {
            const Icon = TYPE_ICONS[notif.type] || Bell;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'bg-card rounded-xl border p-4 cursor-pointer transition-colors',
                  notif.isRead ? 'border-border' : 'border-primary/30 bg-primary/5'
                )}
                onClick={() => toast.info('Notification marked as read')}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', TYPE_COLORS[notif.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm font-semibold', notif.isRead ? 'text-foreground' : 'text-foreground')}>
                        {notif.title}
                        {!notif.isRead && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-primary align-middle" />
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
