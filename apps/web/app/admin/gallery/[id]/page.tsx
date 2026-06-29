'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function EditGalleryItem() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', category: '', projectId: '', isFeatured: false, isActive: false,
  });

  useEffect(() => {
    adminApi.get<any>(`/gallery/${params.id}`)
      .then((item) => {
        setForm({
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.imageUrl || '',
          category: item.category || '',
          projectId: item.projectId || '',
          isFeatured: item.isFeatured ?? false,
          isActive: item.isActive ?? false,
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/gallery/${params.id}`, form);
      router.push('/admin/gallery');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Gallery Image" backHref="/admin/gallery" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} required />
      <FormField label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} required placeholder="https://..." />
      <FormField label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Healthcare, Water, Education" />
      <FormField label="Project ID (optional)" name="projectId" value={form.projectId} onChange={handleChange} placeholder="Link to a project" />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="rounded border-gray-300" />
        <label htmlFor="isFeatured" className="text-sm text-gray-700 font-medium">Featured</label>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="rounded border-gray-300" />
        <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active</label>
      </div>
    </FormCard>
  );
}
