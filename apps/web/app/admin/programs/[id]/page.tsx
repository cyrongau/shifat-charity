'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function EditProgram() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: '', image: '',
    status: 'ACTIVE', startDate: '', endDate: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/programs/${params.id}`)
      .then((item) => {
        setForm({
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          image: item.image || '',
          status: item.status || 'ACTIVE',
          startDate: item.startDate ? item.startDate.slice(0, 10) : '',
          endDate: item.endDate ? item.endDate.slice(0, 10) : '',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/programs/${params.id}`, form);
      router.push('/admin/programs');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Program" backHref="/admin/programs" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={5} />
      <FormField label="Category" name="category" value={form.category} onChange={handleChange} />
      <FormField
        label="Status" name="status" type="select" value={form.status} onChange={handleChange}
        options={[{ label: 'Active', value: 'ACTIVE' }, { label: 'Inactive', value: 'INACTIVE' }, { label: 'Completed', value: 'COMPLETED' }]}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <FormField label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
      </div>
      <ImageUpload label="Image URL" value={form.image} onChange={(url) => handleChange('image', url)} />
    </FormCard>
  );
}
