'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { Download, Trash2, Lock, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

/* ── section wrapper ─────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-[#1A1A2E]">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ── orange toggle ───────────────────────────────────────── */

function OrangeToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0',
        checked ? 'bg-[#E85D04]' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  );
}

/* ── input field ─────────────────────────────────────────── */

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 font-medium block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20"
      />
    </div>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState({
    dueDateReminders: true,
    overdueAlerts: true,
    paymentConfirmations: true,
  });
  const [language, setLanguage] = useState<'en' | 'am'>('en');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('full_name, phone_number, city').eq('id', user.id).single();
      if (profile) {
        setOwnerName(profile.full_name || '');
        setPhoneNumber(profile.phone_number || '');
        setCity(profile.city || '');
      }
      const { data: shop } = await supabase.from('shops').select('shop_name').eq('owner_id', user.id).single();
      if (shop) setShopName(shop.shop_name || '');
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSaveInfo = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error: profileError } = await supabase.from('profiles').update({
      full_name: ownerName,
      phone_number: phoneNumber,
      city: city,
    }).eq('id', user.id);
    if (profileError) {
      setError('Failed to update profile: ' + profileError.message);
      setSaving(false);
      return;
    }
    const { error: shopError } = await supabase.from('shops').update({ shop_name: shopName }).eq('owner_id', user.id);
    if (shopError) {
      setError('Failed to update shop: ' + shopError.message);
      setSaving(false);
      return;
    }
    setSuccess('Settings saved successfully');
    setSaving(false);
  };

  const handleChangePassword = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setSaving(false);
      return;
    }
    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
    if (passwordError) {
      setError('Failed to change password: ' + passwordError.message);
      setSaving(false);
      return;
    }
    setSuccess('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaving(false);
  };

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((p) => ({ ...p, [key]: !p[key] }));

  if (loading) {
    return (
      <AppLayout><AppHeader />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-5 pb-24 md:pb-8 max-w-xl">

        {/* Success / Error banners */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl">
            <CheckCircle className="h-4 w-4 shrink-0" />{success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}

        {/* ── Shop Information ── */}
        <Section title="Shop Information">
          <Field label="Shop Name" value={shopName} onChange={setShopName} placeholder="Your shop name" />
          <Field label="Owner Name" value={ownerName} onChange={setOwnerName} placeholder="Your full name" />
          <Field label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="+251 9xx xxx xxx" />
          <Field label="City" value={city} onChange={setCity} placeholder="e.g. Addis Ababa" />
          <button
            onClick={handleSaveInfo}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] disabled:opacity-60 text-white font-bold text-sm transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </Section>

        {/* ── Security ── */}
        <Section title="Security">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-3">Change your password</p>
            <div className="space-y-3">
              <Field label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="••••••••" />
              <Field label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="••••••••" />
              <Field label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="••••••••" />
            </div>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] disabled:opacity-60 text-white font-bold text-sm transition-colors"
          >
            <Lock className="h-4 w-4" />
            {saving ? 'Saving…' : 'Change Password'}
          </button>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          {([
            { key: 'dueDateReminders',     label: 'Due Date Reminders',    desc: 'Get notified before a loan is due' },
            { key: 'overdueAlerts',        label: 'Overdue Alerts',        desc: 'Get alerted when a loan becomes overdue' },
            { key: 'paymentConfirmations', label: 'Payment Confirmations', desc: 'Notify when a buyer confirms payment' },
          ] as const).map((item, i, arr) => (
            <div key={item.key}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <OrangeToggle checked={notifications[item.key]} onChange={() => toggleNotif(item.key)} />
              </div>
              {i < arr.length - 1 && <div className="border-t border-gray-100 mt-4" />}
            </div>
          ))}
        </Section>

        {/* ── Language ── */}
        <Section title="Language">
          <div className="flex gap-3">
            {([
              { value: 'en', label: 'English' },
              { value: 'am', label: 'አማርኛ' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLanguage(opt.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex-1 justify-center',
                  language === opt.value
                    ? 'border-[#E85D04] bg-[#FFF3E0] text-[#E85D04]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                <span className={cn('h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0', language === opt.value ? 'border-[#E85D04]' : 'border-gray-300')}>
                  {language === opt.value && <span className="h-2 w-2 rounded-full bg-[#E85D04]" />}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Data ── */}
        <Section title="Data">
          <p className="text-xs text-gray-400">Export your loan records</p>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors">
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-red-200">
            <h2 className="font-bold text-red-600">Danger Zone</h2>
          </div>
          <div className="p-5 space-y-3">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500 text-red-500 hover:bg-red-100 font-bold text-sm transition-colors">
              <LogOut className="h-4 w-4" /> Logout
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">
              <Trash2 className="h-4 w-4" /> Delete Account
            </button>
            <p className="text-xs text-red-400 mt-3 text-center leading-relaxed">
              This action is permanent and cannot be undone. All your loans, customers, and records will be deleted forever.
            </p>
          </div>
        </div>

      </main>
    </AppLayout>
  );
}
