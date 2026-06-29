'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function NewPublication() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', image: '', fileUrl: '',
    author: '', type: 'REPORT', status: 'DRAFT', publishedAt: '',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/publications', form);
      router.push('/admin/publications');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Publication" backHref="/admin/publications" onSubmit={handleSubmit} loading={loading}>
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
