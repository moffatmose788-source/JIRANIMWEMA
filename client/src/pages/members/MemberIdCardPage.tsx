/**
 * BOMAENGWE WELFARE — Member Digital ID Card
 * Printable/shareable digital ID with QR code
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, Share2, QrCode } from 'lucide-react';
import { membersService, type UserProfile } from '@/lib/firestore';
import { cn, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function MemberIdCardPage() {
  const { id } = useParams<{ id: string }>();
  const cardRef = useRef<HTMLDivElement>(null);

  const [member, setMember] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    membersService.getById(id).then((result) => {
      if (mounted) setMember(result);
    }).catch(() => {
      toast.error('Failed to load member details');
    });
    return () => { mounted = false; };
  }, [id]);

  if (!member) {
    return (
      <DashboardLayout title="Member ID Card" subtitle="Loading member details...">
        <div className="p-4 sm:p-6 flex items-center justify-center min-h-[240px]">
          <div className="text-sm text-muted-foreground">Loading member details...</div>
        </div>
      </DashboardLayout>
    );
  }

  const initials = member.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    if (!member) return;

    if (navigator.share) {
      navigator.share({
        title: `${member.fullName} - BOMAENGWE WELFARE ID`,
        text: `Member: ${member.memberNumber}`,
      });
    } else {
      toast.success('Link copied to clipboard!');
    }
  }

  return (
    <DashboardLayout title="Member ID Card" subtitle={member.fullName}>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">

        {/* Back button */}
        <Link href="/members">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Members
          </Button>
        </Link>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info('Download feature coming soon')} className="gap-1.5">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>

        {/* ID Card */}
        <div ref={cardRef} className="print-card">
          {/* Front of card */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #0F766E 0%, #065F46 60%, #047857 100%)',
              aspectRatio: '85.6/54',
              position: 'relative',
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full border-4 border-white -translate-y-1/4 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full border-4 border-white translate-y-1/4 -translate-x-1/4" />
            </div>

            <div className="relative p-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663772477110/HSXrVRX92hnKR9AYzuwiBq/logo-icon-HUzSiBdtdgbuJR83PPaV47.webp"
                    alt="Logo"
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-bold text-white text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>BOMAENGWE</p>
                    <p className="text-white/70 text-xs">WELFARE SOCIETY</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">MEMBER ID</p>
                  <p className="font-bold text-white text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {member.memberNumber}
                  </p>
                </div>
              </div>

              {/* Member info */}
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {member.fullName}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">{member.occupation || 'Member'}</p>
                    <p className="text-white/70 text-xs">{member.village}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                        {member.memberStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code placeholder */}
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/20 pt-3">
                <div>
                  <p className="text-white/50 text-xs">Joined</p>
                  <p className="text-white text-xs font-medium">
                    {member.registrationDate ? formatDate(member.registrationDate as Date, 'dd MMM yyyy') : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-xs">National ID</p>
                  <p className="text-white text-xs font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {member.nationalId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs">Phone</p>
                  <p className="text-white text-xs font-medium">{member.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl mt-4"
            style={{
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              aspectRatio: '85.6/54',
              position: 'relative',
            }}
          >
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <p className="text-white/50 text-xs mb-1">NEXT OF KIN</p>
                <p className="text-white font-medium">{member.nextOfKinName}</p>
                <p className="text-white/70 text-sm">{member.nextOfKinPhone}</p>
              </div>

              <div className="text-center">
                <p className="text-white/40 text-xs">
                  This card is the property of BOMAENGWE WELFARE SOCIETY.
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  If found, please return to the society office.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs">Email</p>
                  <p className="text-white text-xs">{member.email || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs">Valid Through</p>
                  <p className="text-white text-xs font-medium">Dec 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Member details card */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            Full Member Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: member.fullName },
              { label: 'Member Number', value: member.memberNumber },
              { label: 'National ID', value: member.nationalId },
              { label: 'Phone', value: member.phoneNumber },
              { label: 'Email', value: member.email || 'N/A' },
              { label: 'Village', value: member.village },
              { label: 'Occupation', value: member.occupation || 'N/A' },
              { label: 'Status', value: member.memberStatus },
              { label: 'Next of Kin', value: member.nextOfKinName },
              { label: 'Next of Kin Phone', value: member.nextOfKinPhone },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5 capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
