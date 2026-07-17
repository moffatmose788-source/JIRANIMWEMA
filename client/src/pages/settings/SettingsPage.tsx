/**
 * BOMAENGWE WELFARE — Settings Page
 * Firebase configuration, theme, language, society settings
 */

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Settings, Database, Globe, Moon, Sun, Bell, Shield, DollarSign,
  Save, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    contributions: true,
    loans: true,
    welfare: true,
    meetings: true,
    announcements: true,
  });
  const [firebaseConfig, setFirebaseConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [societySettings, setSocietySettings] = useState({
    monthlyContribution: '500',
    loanInterestRate: '12',
    maxLoanMultiplier: '3',
    currency: 'KES',
    contributionDay: '1',
  });

  function handleSaveFirebase() {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      toast.error('Please fill in all required Firebase fields');
      return;
    }
    toast.success('Firebase configuration saved! Restart the app to apply changes.');
  }

  function handleSaveSociety() {
    toast.success('Society settings saved successfully!');
  }

  return (
    <DashboardLayout title="Settings" subtitle="Configure society and system settings">
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <Tabs defaultValue="general">
          <TabsList className="mb-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="society">Society</TabsTrigger>
            <TabsTrigger value="firebase">Firebase</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-5">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Appearance</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Language</p>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="sw">🇰🇪 Kiswahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Security</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Change Password</p>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Password change coming soon')}>
                  Change Password
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('2FA coming soon')}>
                  Enable 2FA
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Society Settings */}
          <TabsContent value="society" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Society Configuration</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium">Monthly Contribution (KES)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={societySettings.monthlyContribution}
                    onChange={(e) => setSocietySettings({ ...societySettings, monthlyContribution: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Loan Interest Rate (% p.a.)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={societySettings.loanInterestRate}
                    onChange={(e) => setSocietySettings({ ...societySettings, loanInterestRate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Max Loan Multiplier (x contributions)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={societySettings.maxLoanMultiplier}
                    onChange={(e) => setSocietySettings({ ...societySettings, maxLoanMultiplier: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Currency</Label>
                  <Select value={societySettings.currency} onValueChange={(v) => setSocietySettings({ ...societySettings, currency: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                      <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium">Contribution Due Day (of month)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    min="1"
                    max="28"
                    value={societySettings.contributionDay}
                    onChange={(e) => setSocietySettings({ ...societySettings, contributionDay: e.target.value })}
                  />
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 gap-1.5" onClick={handleSaveSociety}>
                <Save className="w-4 h-4" /> Save Society Settings
              </Button>
            </motion.div>
          </TabsContent>

          {/* Firebase Settings */}
          <TabsContent value="firebase" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Firebase Configuration</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep your Firebase settings up to date so authentication and Firestore persistence work correctly. This section helps you confirm the configured Firebase project values.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Firebase Configuration</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your Firebase config from the Firebase Console → Project Settings → Your apps → Firebase SDK snippet.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'API Key', key: 'apiKey', placeholder: 'AIzaSy...' },
                  { label: 'Auth Domain', key: 'authDomain', placeholder: 'project.firebaseapp.com' },
                  { label: 'Project ID', key: 'projectId', placeholder: 'my-project' },
                  { label: 'Storage Bucket', key: 'storageBucket', placeholder: 'project.appspot.com' },
                  { label: 'Messaging Sender ID', key: 'messagingSenderId', placeholder: '123456789' },
                  { label: 'App ID', key: 'appId', placeholder: '1:123456789:web:abc...' },
                ].map((field) => (
                  <div key={field.key}>
                    <Label className="text-xs font-medium">{field.label}</Label>
                    <Input
                      className="mt-1 font-mono text-xs"
                      placeholder={field.placeholder}
                      value={firebaseConfig[field.key as keyof typeof firebaseConfig]}
                      onChange={(e) => setFirebaseConfig({ ...firebaseConfig, [field.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <Button className="bg-primary hover:bg-primary/90 gap-1.5" onClick={handleSaveFirebase}>
                <Save className="w-4 h-4" /> Save Firebase Config
              </Button>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Notification Preferences</h3>

              {[
                { key: 'contributions', label: 'Contribution Reminders', desc: 'Get notified when contributions are due or recorded' },
                { key: 'loans', label: 'Loan Updates', desc: 'Notifications for loan applications and repayments' },
                { key: 'welfare', label: 'Welfare Updates', desc: 'Updates on welfare request status changes' },
                { key: 'meetings', label: 'Meeting Reminders', desc: 'Reminders for upcoming society meetings' },
                { key: 'announcements', label: 'Announcements', desc: 'New announcements from the committee' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(v) => {
                      setNotifications({ ...notifications, [item.key]: v });
                      toast.success(`${item.label} ${v ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
