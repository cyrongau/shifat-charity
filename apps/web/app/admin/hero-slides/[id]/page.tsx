'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

const PAGE_OPTIONS = [
  { label: 'Home', value: 'home' },
  { label: 'About', value: 'about' },
  { label: 'Programs', value: 'programs' },
  { label: 'Contact', value: 'contact' },
  { label: 'Get Involved', value: 'get-involved' },
];

export default function EditHeroSlide() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    page: 'home', imageUrl: '', tagline: '', title: '', description: '',
    ctaText: '', ctaLink: '', secondaryCtaText: '', secondaryCtaLink: '',
    sortOrder: '0', isActive: true,
  });

  useEffect(() => {
    adminApi.get<any>(`/hero-slides/${params.id}`)
      .then((item) => setForm({
        page: item.page || 'home',
        imageUrl: item.imageUrl || '',
        tagline: item.tagline || '',
        title: item.title || '',
        description: item.description || '',
        ctaText: item.ctaText || '',
        ctaLink: item.ctaLink || '',
        secondaryCtaText: item.secondaryCtaText || '',
        secondaryCtaLink: item.secondaryCtaLink || '',
        sortOrder: item.sortOrder?.toString() || '0',
        isActive: item.isActive ?? true,
      }))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await adminApi.patch(`/hero-slides/${params.id}`, {
        ...form,
        sortOrder: parseInt(form.sortOrder) || 0,
      });
      router.push('/admin/hero-slides');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <FormCard title="Edit Hero Slide" backHref="/admin/hero-slides" onSubmit={handleSubmit} loading={saving}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Page" name="page" type="select" value={form.page} onChange={handleChange} options={PAGE_OPTIONS} required />
      <ImageUpload label="Background Image" value={form.imageUrl} onChange={(url) => handleChange('imageUrl', url)} />
      <FormField label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="CTA Text" name="ctaText" value={form.ctaText} onChange={handleChange} />
        <FormField label="CTA Link" name="ctaLink" value={form.ctaLink} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Secondary CTA Text" name="secondaryCtaText" value={form.secondaryCtaText} onChange={handleChange} />
        <FormField label="Secondary CTA Link" name="secondaryCtaLink" value={form.secondaryCtaLink} onChange={handleChange} />
      </div>
      <FormField label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
      <FormField label="Active" name="isActive" type="select" value={form.isActive ? 'true' : 'false'} onChange={(n, v) => handleChange('isActive', v === 'true' ? 'true' : 'false')} options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]} />
    </FormCard>
  );
}
