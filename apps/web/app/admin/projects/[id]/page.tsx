'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function EditProject() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', image: '', location: '',
    status: 'ACTIVE', goal: '', progress: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/projects/${params.id}`)
      .then((item) => {
        setForm({
          title: item.title || '',
          description: item.description || '',
          image: item.image || '',
          location: item.location || '',
          status: item.status || 'ACTIVE',
          goal: item.goal || '',
          progress: item.progress || '',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/projects/${params.id}`, form);
      router.push('/admin/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Project" backHref="/admin/projects" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={5} />
      <FormField label="Location" name="location" value={form.location} onChange={handleChange} />
      <FormField label="Goal" name="goal" type="number" value={form.goal} onChange={handleChange} />
      <FormField label="Progress" name="progress" type="number" value={form.progress} onChange={handleChange} />
      <FormField
        label="Status" name="status" type="select" value={form.status} onChange={handleChange}
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Completed', value: 'COMPLETED' },
        ]}
      />
      <ImageUpload label="Image URL" value={form.image} onChange={(url) => handleChange('image', url)} />
    </FormCard>
  );
}
