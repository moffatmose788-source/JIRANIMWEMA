/**
 * BOMAENGWE WELFARE — Meetings Page
 */

import { useEffect, useState } from 'react';
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
import { CalendarDays, Plus, MapPin, Users, Clock, CheckCircle2, FileText } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { meetingsService, type Meeting } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface MeetingForm {
  title: string;
  date: string;
  time: string;
  venue: string;
  type: string;
  agenda: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  postponed: { label: 'Postponed', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

export default function MeetingsPage() {
  const { role, currentUser } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const { register, handleSubmit, reset, setValue } = useForm<MeetingForm>();

  const isAdmin = role === 'admin' || role === 'committee';

  useEffect(() => {
    let mounted = true;

    async function loadMeetings() {
      try {
        const items = await meetingsService.getAll();
        if (!mounted) return;
        setMeetings(items);
      } catch {
        toast.error('Failed to load meetings');
      } finally {
        if (mounted) setDataLoading(false);
      }
    }

    loadMeetings();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = meetings.filter((m) =>
    filter === 'all' || m.status === filter
  );

  async function onAdd(data: MeetingForm) {
    setLoading(true);
    try {
      await meetingsService.create({
        title: data.title,
        date: new Date(`${data.date}T${data.time}`),
        venue: data.venue,
        agenda: data.agenda,
        type: data.type,
        status: 'scheduled',
        organizer: currentUser?.email || 'system',
      });
      toast.success(`Meeting "${data.title}" scheduled successfully!`);
      const items = await meetingsService.getAll();
      setMeetings(items);
      setAddOpen(false);
      reset();
    } catch {
      toast.error('Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Meetings" subtitle="Schedule and manage society meetings">
      <div className="p-4 sm:p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Scheduled', value: meetings.filter((m) => m.status === 'scheduled').length, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
            { label: 'Completed', value: meetings.filter((m) => m.status === 'completed').length, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
            { label: 'Total', value: meetings.length, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', stat.color)}>
                <CalendarDays className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-foreground stat-number">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                  <Plus className="w-4 h-4" /> Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Sora, sans-serif' }}>Schedule Meeting</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4 mt-2">
                  <div>
                    <Label className="text-xs font-medium">Meeting Title *</Label>
                    <Input className="mt-1" placeholder="Monthly General Meeting" {...register('title', { required: true })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium">Date *</Label>
                      <Input type="date" className="mt-1" {...register('date', { required: true })} />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Time *</Label>
                      <Input type="time" className="mt-1" {...register('time', { required: true })} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Venue *</Label>
                    <Input className="mt-1" placeholder="Community Hall, Kiambu" {...register('venue', { required: true })} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Meeting Type</Label>
                    <Select onValueChange={(v) => setValue('type', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Meeting</SelectItem>
                        <SelectItem value="emergency">Emergency Meeting</SelectItem>
                        <SelectItem value="committee">Committee Meeting</SelectItem>
                        <SelectItem value="agm">AGM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Agenda</Label>
                    <Textarea className="mt-1" rows={3} placeholder="Meeting agenda items..." {...register('agenda')} />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? 'Scheduling...' : 'Schedule Meeting'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Meetings list */}
        <div className="space-y-3">
          {filtered.map((meeting, i) => {
            const status = STATUS_CONFIG[meeting.status] || STATUS_CONFIG.scheduled;
            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-xl border border-border p-4 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                      <p className="text-xs font-bold text-primary leading-none">
                        {formatDate(meeting.date as Date, 'dd')}
                      </p>
                      <p className="text-xs text-primary/70">
                        {formatDate(meeting.date as Date, 'MMM')}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{meeting.title}</p>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.color)}>
                          {status.label}
                        </span>
                        {meeting.type && (
                          <Badge variant="secondary" className="text-xs capitalize">{meeting.type}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(meeting.date as Date, 'HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{meeting.venue}</span>
                        </div>
                        {meeting.attendanceCount !== undefined && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{meeting.attendanceCount} attended</span>
                          </div>
                        )}
                      </div>
                      {meeting.agenda && (
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{meeting.agenda}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {meeting.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1"
                        onClick={() => toast.info('Minutes download coming soon')}
                      >
                        <FileText className="w-3 h-3" /> Minutes
                      </Button>
                    )}
                    {isAdmin && meeting.status === 'scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1"
                        onClick={() => toast.success('Attendance marked!')}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark Attendance
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No meetings found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
