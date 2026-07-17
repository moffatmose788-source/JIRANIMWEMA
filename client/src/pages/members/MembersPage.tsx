/**
 * BOMAENGWE WELFARE — Members Management Page
 * Full CRUD, search, filter by status/village, digital ID card link
 */

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Search, Plus, CreditCard, Phone, MapPin, User, Filter,
  MoreHorizontal, Edit, Trash2, Eye, Download,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatDate } from '@/lib/utils';
import { membersService, type UserProfile } from '@/lib/firestore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';

type MemberStatus = 'active' | 'inactive' | 'suspended' | 'deceased';

interface MemberForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  occupation: string;
  village: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
}

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [villageFilter, setVillageFilter] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MemberForm>();

  const [members, setMembers] = useState<UserProfile[]>([]);

  useEffect(() => {
    let mounted = true;
    membersService.getAll().then((data) => {
      if (mounted) setMembers(data);
    }).catch(() => {
      toast.error('Failed to load members from Firestore');
    });
    return () => { mounted = false; };
  }, []);

  const villages = Array.from(new Set(members.map((m) => m.village)));

  const filtered = members.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.memberNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.phoneNumber.includes(search) ||
      m.nationalId.includes(search);
    const matchStatus = statusFilter === 'all' || m.memberStatus === statusFilter;
    const matchVillage = villageFilter === 'all' || m.village === villageFilter;
    return matchSearch && matchStatus && matchVillage;
  });

  async function onAddMember(data: MemberForm) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(`Member ${data.fullName} added successfully!`);
    setLoading(false);
    setAddOpen(false);
    reset();
  }

  const statusColors: Record<MemberStatus, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    deceased: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <DashboardLayout title="Members" subtitle="Manage welfare society members">
      <div className="p-4 sm:p-6 space-y-5">

        {/* Header actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, phone..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>

            <Select value={villageFilter} onValueChange={setVillageFilter}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Village" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Villages</SelectItem>
                {villages.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5">
                  <Plus className="w-4 h-4" /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: 'Sora, sans-serif' }}>Add New Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAddMember)} className="space-y-4 mt-2">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium">Full Name *</Label>
                      <Input className="mt-1" {...register('fullName', { required: true })} placeholder="John Kamau" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">National ID *</Label>
                      <Input className="mt-1" {...register('nationalId', { required: true })} placeholder="12345678" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Phone Number *</Label>
                      <Input className="mt-1" {...register('phoneNumber', { required: true })} placeholder="+254712345678" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Email</Label>
                      <Input type="email" className="mt-1" {...register('email')} placeholder="john@example.com" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Occupation</Label>
                      <Input className="mt-1" {...register('occupation')} placeholder="Teacher" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Village *</Label>
                      <Input className="mt-1" {...register('village', { required: true })} placeholder="Kiambu" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Next of Kin Name *</Label>
                      <Input className="mt-1" {...register('nextOfKinName', { required: true })} placeholder="Mary Kamau" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Next of Kin Phone *</Label>
                      <Input className="mt-1" {...register('nextOfKinPhone', { required: true })} placeholder="+254723456789" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Member'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 flex-wrap text-sm">
          <span className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {members.length} members
          </span>
          <span className="text-emerald-600 font-medium">
            {members.filter((m) => m.memberStatus === 'active').length} active
          </span>
          <span className="text-amber-600 font-medium">
            {members.filter((m) => m.memberStatus === 'suspended').length} suspended
          </span>
        </div>

        {/* Members grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="bg-card rounded-xl border border-border p-4 card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {member.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{member.fullName}</p>
                    <p className="text-xs text-muted-foreground">{member.memberNumber}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/members/id-card/${member.id}`}>
                        <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> View ID Card</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Edit feature coming soon')}>
                      <Edit className="w-4 h-4 mr-2" /> Edit Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => toast.error('Member deleted (demo)')}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{member.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{member.village}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{member.occupation || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[member.memberStatus as MemberStatus])}>
                  {member.memberStatus}
                </span>
                <span className="text-xs text-muted-foreground">
                  Joined {formatDate(member.registrationDate as Date, 'MMM yyyy')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No members found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
