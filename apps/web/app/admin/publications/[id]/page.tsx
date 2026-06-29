'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function EditPublication() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', image: '', fileUrl: '',
    author: '', type: 'REPORT', status: 'DRAFT', publishedAt: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/publications/${params.id}`)
      .then((item) => {
        setForm({
          title: item.title || '',
          description: item.description || '',
          image: item.image || '',
          fileUrl: item.fileUrl || '',
          author: item.author || '',
          type: item.type || 'REPORT',
          status: item.status || 'DRAFT',
          publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : '',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/publications/${params.id}`, form);
      router.push('/admin/publications');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Publication" backHref="/admin/publications" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={5} />
      <FormField label="Author" name="author" value={form.author} onChange={handleChange} />
      <FormField label="File URL" name="fileUrl" type="url" value={form.fileUrl} onChange={handleChange} />
      <FormField
        label="Type" name="type" type="select" value={form.type} onChange={handleChange}
        options={[
          { label: 'Report', value: 'REPORT' },
          { label: 'Brochure', value: 'BROCHURE' },
          { label: 'Newsletter', value: 'NEWSLETTER' },
          { label: 'Annual', value: 'ANNUAL' },
        ]}
      />
      <FormField
        label="Status" name="status" type="select" value={form.status} onChange={handleChange}
        options={[
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Published', value: 'PUBLISHED' },
        ]}
      />
      <FormField label="Published At" name="publishedAt" type="date" value={form.publishedAt} onChange={handleChange} />
      <ImageUpload label="Image URL" value={form.image} onChange={(url) => handleChange('image', url)} />
    </FormCard>
  );
}
