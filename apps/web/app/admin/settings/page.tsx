'use client';

import { useState, useEffect } from 'react';
import { Save, Check, Globe, Search, Palette, FileText, Link, Menu } from 'lucide-react';
import { adminApi } from '../../../lib/admin-api';
import ImageUpload from '../../../components/admin/ImageUpload';

const TABS = [
  { id: 'identity', label: 'System Identity', icon: Globe },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'brand', label: 'Brand Identity', icon: Palette },
  { id: 'footer', label: 'Footer & Contact', icon: FileText },
  { id: 'mega-menu', label: 'Mega Menu', icon: Menu },
  { id: 'integrations', label: 'Integrations', icon: Link },
];

interface Settings {
  siteName: string; siteDescription: string; contactEmail: string;
  facebookUrl?: string; twitterUrl?: string; instagramUrl?: string;
  metaTitle?: string; metaDescription?: string; metaKeywords?: string;
  metaKeyphrases?: string; siteTag?: string; ogImageUrl?: string;
  lightLogoUrl?: string; darkLogoUrl?: string; iconUrl?: string; faviconUrl?: string;
  footerDescription?: string; footerEmail?: string; footerPhone?: string; footerAddress?: string;
  contactPhone?: string; contactEmailAddress?: string; contactAddress?: string; contactMapUrl?: string;
  smtpHost?: string; smtpPort?: number; smtpUser?: string; smtpPass?: string;
  smtpFromEmail?: string; smtpFromName?: string;
  stripePublicKey?: string; stripeSecretKey?: string; stripeWebhookSecret?: string;
  fcmServerKey?: string;
  featuredProgramId?: string;
}

interface ProgramOption { id: string; title: string; }

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('identity');
  const [form, setForm] = useState<Settings>({
    siteName: '', siteDescription: '', contactEmail: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);

  useEffect(() => {
    Promise.all([
      adminApi.get<Settings>('/settings'),
      adminApi.get<{ data: ProgramOption[] }>('/programs?limit=100'),
    ]).then(([settings, progRes]) => {
      setForm(settings);
      setPrograms(progRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Settings, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.put('/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Settings</h1>
          <p className="text-gray-500 mt-1">Manage system configuration.</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'identity' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">General</h2>
              <Field label="Site Name" value={form.siteName} onChange={(v) => set('siteName', v)} />
              <Field label="Site Description" type="textarea" rows={3} value={form.siteDescription} onChange={(v) => set('siteDescription', v)} />
              <Field label="Contact Email" type="email" value={form.contactEmail} onChange={(v) => set('contactEmail', v)} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">Social Links</h2>
              <Field label="Facebook URL" type="url" placeholder="https://facebook.com/..." value={form.facebookUrl || ''} onChange={(v) => set('facebookUrl', v)} />
              <Field label="Twitter URL" type="url" placeholder="https://twitter.com/..." value={form.twitterUrl || ''} onChange={(v) => set('twitterUrl', v)} />
              <Field label="Instagram URL" type="url" placeholder="https://instagram.com/..." value={form.instagramUrl || ''} onChange={(v) => set('instagramUrl', v)} />
            </div>
          </>
        )}

        {activeTab === 'seo' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-brand-charcoal">Search Engine Optimization</h2>
            <p className="text-xs text-gray-400 -mt-2">Configure how your site appears in search engines and social shares.</p>
            <Field label="Meta Title (Site Title)" value={form.metaTitle || ''} onChange={(v) => set('metaTitle', v)} placeholder="Shifat Foundation | Empowering Communities" />
            <Field label="Meta Description" type="textarea" rows={3} value={form.metaDescription || ''} onChange={(v) => set('metaDescription', v)} placeholder="A non-profit organization dedicated to making a difference..." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Keywords" value={form.metaKeywords || ''} onChange={(v) => set('metaKeywords', v)} placeholder="charity, non-profit, community" />
              <Field label="Keyphrases" value={form.metaKeyphrases || ''} onChange={(v) => set('metaKeyphrases', v)} placeholder="helping communities, charity foundation" />
            </div>
            <Field label="Site Tag" value={form.siteTag || ''} onChange={(v) => set('siteTag', v)} placeholder="Empowering Communities, Transforming Lives" />
            <Field label="OG Image URL" type="url" value={form.ogImageUrl || ''} onChange={(v) => set('ogImageUrl', v)} placeholder="https://shifat.org/og-image.jpg" />
          </div>
        )}

        {activeTab === 'brand' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-brand-charcoal">Brand Assets</h2>
            <p className="text-xs text-gray-400 -mt-2">Upload brand logos and icons. Images are stored in MinIO and URLs are saved automatically.</p>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload label="Light Logo" value={form.lightLogoUrl || ''} onChange={(v) => set('lightLogoUrl', v)} />
              <ImageUpload label="Dark Logo" value={form.darkLogoUrl || ''} onChange={(v) => set('darkLogoUrl', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload label="Icon" value={form.iconUrl || ''} onChange={(v) => set('iconUrl', v)} />
              <ImageUpload label="Favicon" value={form.faviconUrl || ''} onChange={(v) => set('faviconUrl', v)} />
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">Footer</h2>
              <Field label="Footer Description" type="textarea" rows={3} value={form.footerDescription || ''} onChange={(v) => set('footerDescription', v)} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Footer Email" type="email" value={form.footerEmail || ''} onChange={(v) => set('footerEmail', v)} />
                <Field label="Footer Phone" value={form.footerPhone || ''} onChange={(v) => set('footerPhone', v)} />
              </div>
              <Field label="Footer Address" type="textarea" rows={2} value={form.footerAddress || ''} onChange={(v) => set('footerAddress', v)} />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">Contact Page</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Contact Phone" value={form.contactPhone || ''} onChange={(v) => set('contactPhone', v)} />
                <Field label="Contact Email" type="email" value={form.contactEmailAddress || ''} onChange={(v) => set('contactEmailAddress', v)} />
              </div>
              <Field label="Contact Address" type="textarea" rows={2} value={form.contactAddress || ''} onChange={(v) => set('contactAddress', v)} />
              <Field label="Map Embed URL" type="url" value={form.contactMapUrl || ''} onChange={(v) => set('contactMapUrl', v)} placeholder="https://maps.google.com/..." />
            </div>
          </>
        )}

        {activeTab === 'mega-menu' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-brand-charcoal">Mega Menu</h2>
            <p className="text-xs text-gray-400 -mt-2">Select a program to feature in the navigation mega menu's support initiative card.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Program</label>
              <select
                value={form.featuredProgramId || ''}
                onChange={(e) => set('featuredProgramId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none bg-white"
              >
                <option value="">None (hide featured card)</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">Email (SMTP)</h2>
              <p className="text-xs text-gray-400 -mt-2">Configure outbound email for campaigns and notifications.</p>
              <div className="grid grid-cols-3 gap-4">
                <Field label="SMTP Host" value={form.smtpHost || ''} onChange={(v) => set('smtpHost', v)} placeholder="smtp.gmail.com" />
                <Field label="SMTP Port" type="number" value={form.smtpPort?.toString() || ''} onChange={(v) => set('smtpPort', v ? parseInt(v) : undefined)} placeholder="587" />
                <Field label="SMTP User" value={form.smtpUser || ''} onChange={(v) => set('smtpUser', v)} />
              </div>
              <Field label="SMTP Password" type="password" value={form.smtpPass || ''} onChange={(v) => set('smtpPass', v)} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="From Email" type="email" value={form.smtpFromEmail || ''} onChange={(v) => set('smtpFromEmail', v)} placeholder="noreply@shifat.org" />
                <Field label="From Name" value={form.smtpFromName || ''} onChange={(v) => set('smtpFromName', v)} placeholder="Shifat Foundation" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">Payments</h2>
              <p className="text-xs text-gray-400 -mt-2">Stripe API credentials for payment processing.</p>
              <Field label="Publishable Key" value={form.stripePublicKey || ''} onChange={(v) => set('stripePublicKey', v)} placeholder="pk_live_..." />
              <Field label="Secret Key" type="password" value={form.stripeSecretKey || ''} onChange={(v) => set('stripeSecretKey', v)} placeholder="sk_live_..." />
              <Field label="Webhook Secret" type="password" value={form.stripeWebhookSecret || ''} onChange={(v) => set('stripeWebhookSecret', v)} placeholder="whsec_..." />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-brand-charcoal">Push Notifications (FCM)</h2>
              <p className="text-xs text-gray-400 -mt-2">Firebase Cloud Messaging server key for browser push notifications.</p>
              <Field label="FCM Server Key" type="password" value={form.fcmServerKey || ''} onChange={(v) => set('fcmServerKey', v)} />
            </div>
          </>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 brand-gradient text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Settings Saved' : saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, type = 'text', value, onChange, placeholder, rows,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={id} rows={rows || 3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none resize-none"
        />
      ) : (
        <input
          id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
        />
      )}
    </div>
  );
}
