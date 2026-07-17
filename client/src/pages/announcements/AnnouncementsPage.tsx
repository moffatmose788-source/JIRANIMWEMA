/**
 * BOMAENGWE WELFARE — Announcements Page
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
import { Switch } from '@/components/ui/switch';
import { Megaphone, Plus, Pin, Trash2, Edit, Bell } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { announcementsService, membersService, notificationsService, type Announcement, type UserRole } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface AnnouncementForm {
  title: string;
  content: string;
  targetRole: string;
  isPinned: boolean;
}

export default function AnnouncementsPage() {
  const { role } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const { register, handleSubmit, reset, setValue } = useForm<AnnouncementForm>({ defaultValues: { targetRole: 'all', isPinned: false } });

  const isAdmin = role === 'admin' || role === 'committee';

  const pinned = announcements.filter((a) => a.isPinned);
  const regular = announcements.filter((a) => !a.isPinned);

  useEffect(() => {
    let mounted = true;
    announcementsService.getAll().then((data) => {
      if (mounted) setAnnouncements(data);
    }).catch(() => {
      toast.error('Failed to load announcements');
    });
    return () => { mounted = false; };
  }, []);

  async function loadAnnouncements() {
    try {
      const data = await announcementsService.getAll();
      setAnnouncements(data);
    } catch {
      toast.error('Failed to refresh announcements');
    }
  }

  async function onAdd(data: AnnouncementForm) {
    setLoading(true);
    try {
      await announcementsService.create({
        title: data.title,
        content: data.content,
        targetRole: data.targetRole as any,
        isPinned,
        createdBy: 'system',
      });

      const targetMembers =
        data.targetRole === 'all'
          ? await membersService.getAll()
          : await membersService.getByRole(data.targetRole as UserRole);

      await Promise.all(
        targetMembers.map((member) =>
          notificationsService.create({
            userId: member.uid,
            title: `New Announcement: ${data.title}`,
            message: data.content,
            type: 'announcement',
            isRead: false,
          })
        )
      );

      toast.success('Announcement published and notifications sent!');
      await loadAnnouncements();
      setAddOpen(false);
      reset();
      setIsPinned(false);
    } catch {
      toast.error('Failed to publish announcement');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id?: string) {
    if (!id) return;
    try {
      await announcementsService.delete(id);
      toast.success('Announcement deleted');
      await loadAnnouncements();
    } catch {
      toast.error('Failed to delete announcement');
    }
  }

  function AnnouncementCard({ ann, index }: { ann: Announcement; index: number }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className={cn(
          'bg-card rounded-xl border p-4 card-hover',
          ann.isPinned ? 'border-primary/30 bg-primary/5' : 'border-border'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
              ann.isPinned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {ann.isPinned ? <Pin className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground">{ann.title}</p>
                {ann.isPinned && (
                  <Badge className="text-xs bg-primary/20 text-primary border-primary/30">Pinned</Badge>
                )}
                {ann.targetRole && ann.targetRole !== 'all' && (
                  <Badge variant="secondary" className="text-xs capitalize">{ann.targetRole}s only</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{ann.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {ann.createdAt ? formatDate(ann.createdAt as unknown as Date, 'dd MMM yyyy') : 'Recently'}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-1 flex-shrink-0">
              <button
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => toast.info('Edit feature coming soon')}
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                onClick={() => onDelete(ann.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <DashboardLayout title="Announcements" subtitle="Society news and updates">
      <div className="p-4 sm:p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="w-4 h-4" />
            <span>{announcements.length} announcements</span>
          </div>
          {isAdmin && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                  <Plus className="w-4 h-4" /> New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Sora, sans-serif' }}>New Announcement</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4 mt-2">
                  <div>
                    <Label className="text-xs font-medium">Title *</Label>
                    <Input className="mt-1" placeholder="Announcement title" {...register('title', { required: true })} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Content *</Label>
                    <Textarea className="mt-1" rows={4} placeholder="Write your announcement..." {...register('content', { required: true })} />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Target Audience</Label>
                    <Select onValueChange={(v) => setValue('targetRole', v)} defaultValue="all">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="admin">Admin Only</SelectItem>
                        <SelectItem value="committee">Committee</SelectItem>
                        <SelectItem value="member">Members Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isPinned}
                      onCheckedChange={(v) => { setIsPinned(v); setValue('isPinned', v); }}
                    />
                    <Label className="text-sm">Pin this announcement</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
              <Pin className="w-3.5 h-3.5" /> Pinned
            </h3>
            <div className="space-y-3">
              {pinned.map((ann, i) => <AnnouncementCard key={ann.id} ann={ann} index={i} />)}
            </div>
          </div>
        )}

        {/* Regular */}
        {regular.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent</h3>
            <div className="space-y-3">
              {regular.map((ann, i) => <AnnouncementCard key={ann.id} ann={ann} index={i} />)}
            </div>
          </div>
        )}

        {announcements.length === 0 && (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
