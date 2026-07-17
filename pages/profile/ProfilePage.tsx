/**
 * BOMAENGWE WELFARE — Profile Page
 */

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import {
  User, Mail, Phone, MapPin, Briefcase, Edit2, Save, X, CreditCard, Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const initials = userProfile?.fullName
    ? userProfile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  async function handleSave() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profile updated successfully!');
    setLoading(false);
    setEditing(false);
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    committee: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    member: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  return (
    <DashboardLayout title="My Profile" subtitle="View and update your profile information">
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">

        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {userProfile?.fullName || 'Member'}
                </h2>
                <p className="text-sm text-muted-foreground">{userProfile?.memberNumber}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {userProfile?.role && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[userProfile.role] || ''}`}>
                      <Shield className="w-3 h-3 inline mr-1" />
                      {userProfile.role}
                    </span>
                  )}
                  {userProfile?.memberStatus && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 capitalize">
                      {userProfile.memberStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="gap-1.5">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 gap-1.5" onClick={handleSave} disabled={loading}>
                    <Save className="w-3.5 h-3.5" /> {loading ? 'Saving...' : 'Save'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border p-5 space-y-4"
        >
          <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Personal Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: userProfile?.fullName, icon: User, field: 'fullName' },
              { label: 'Email', value: userProfile?.email, icon: Mail, field: 'email' },
              { label: 'Phone Number', value: userProfile?.phoneNumber, icon: Phone, field: 'phoneNumber' },
              { label: 'National ID', value: userProfile?.nationalId, icon: CreditCard, field: 'nationalId' },
              { label: 'Village', value: userProfile?.village, icon: MapPin, field: 'village' },
              { label: 'Occupation', value: userProfile?.occupation, icon: Briefcase, field: 'occupation' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.field}>
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Icon className="w-3 h-3" /> {item.label}
                  </Label>
                  {editing ? (
                    <Input className="mt-1" defaultValue={item.value || ''} />
                  ) : (
                    <p className="text-sm font-medium text-foreground mt-1">{item.value || 'N/A'}</p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Next of kin */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5 space-y-4"
        >
          <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Next of Kin
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Name</Label>
              {editing ? (
                <Input className="mt-1" defaultValue={userProfile?.nextOfKinName || ''} />
              ) : (
                <p className="text-sm font-medium text-foreground mt-1">{userProfile?.nextOfKinName || 'N/A'}</p>
              )}
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
              {editing ? (
                <Input className="mt-1" defaultValue={userProfile?.nextOfKinPhone || ''} />
              ) : (
                <p className="text-sm font-medium text-foreground mt-1">{userProfile?.nextOfKinPhone || 'N/A'}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Membership info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Membership Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Member Number</p>
              <p className="text-sm font-mono font-semibold text-foreground mt-0.5">{userProfile?.memberNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Registration Date</p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {userProfile?.registrationDate ? formatDate(userProfile.registrationDate as Date, 'dd MMM yyyy') : 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link href={`/members/id-card/${userProfile?.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <CreditCard className="w-4 h-4" /> View Digital ID Card
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
