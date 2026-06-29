'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function NewAnnouncement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', content: '', link: '', featuredOrder: '',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/announcements', {
        ...form,
        isActive: true,
        featuredOrder: form.featuredOrder ? parseInt(form.featuredOrder) : undefined,
      });
      router.push('/admin/announcements');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Announcement" backHref="/admin/announcements" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Content" name="content" type="textarea" value={form.content} onChange={handleChange} rows={3} required />
      <FormField label="Link (optional)" name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
      <FormField label="Feature on Banner (1-4)" name="featuredOrder" type="number" value={form.featuredOrder} onChange={handleChange} placeholder="Leave empty for not featured" />
    </FormCard>
  );
}
