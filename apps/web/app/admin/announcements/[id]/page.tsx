'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function EditAnnouncement() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', content: '', link: '', isActive: false, featuredOrder: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/announcements/${params.id}`)
      .then((item) => {
        setForm({
          title: item.title || '',
          content: item.content || '',
          link: item.link || '',
          isActive: item.isActive ?? false,
          featuredOrder: item.featuredOrder?.toString() || '',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/announcements/${params.id}`, {
        ...form,
        featuredOrder: form.featuredOrder ? parseInt(form.featuredOrder) : null,
      });
      router.push('/admin/announcements');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Announcement" backHref="/admin/announcements" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Content" name="content" type="textarea" value={form.content} onChange={handleChange} rows={3} required />
      <FormField label="Link (optional)" name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
      <FormField label="Feature on Banner (1-4)" name="featuredOrder" type="number" value={form.featuredOrder} onChange={handleChange} placeholder="Leave empty for not featured" />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded border-gray-300" />
        <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active</label>
      </div>
    </FormCard>
  );
}
