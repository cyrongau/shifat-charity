'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewHeroSlide() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    page: 'home', imageUrl: '', tagline: '', title: '', description: '',
    ctaText: '', ctaLink: '', secondaryCtaText: '', secondaryCtaLink: '',
    sortOrder: '0',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/hero-slides', {
        ...form,
        sortOrder: parseInt(form.sortOrder) || 0,
      });
      router.push('/admin/hero-slides');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Hero Slide" backHref="/admin/hero-slides" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Page" name="page" type="select" value={form.page} onChange={handleChange} options={PAGE_OPTIONS} required />
      <ImageUpload label="Background Image" value={form.imageUrl} onChange={(url) => handleChange('imageUrl', url)} />
      <FormField label="Tagline (small badge text)" name="tagline" value={form.tagline} onChange={handleChange} />
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="CTA Text" name="ctaText" value={form.ctaText} onChange={handleChange} />
        <FormField label="CTA Link" name="ctaLink" value={form.ctaLink} onChange={handleChange} placeholder="/donate" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Secondary CTA Text" name="secondaryCtaText" value={form.secondaryCtaText} onChange={handleChange} />
        <FormField label="Secondary CTA Link" name="secondaryCtaLink" value={form.secondaryCtaLink} onChange={handleChange} />
      </div>
      <FormField label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} />
    </FormCard>
  );
}
