'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function NewGalleryItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', category: '', projectId: '',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/gallery', { ...form, isFeatured: false, isActive: true });
      router.push('/admin/gallery');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Add Gallery Image" backHref="/admin/gallery" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} required />
      <FormField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} required placeholder="https://..." />
      <FormField label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Healthcare, Water, Education" />
      <FormField label="Project ID (optional)" name="projectId" value={form.projectId} onChange={handleChange} placeholder="Link to a project" />
    </FormCard>
  );
}
