'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function EditCareer() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', department: '', location: '', type: '',
    description: '', requirements: '', status: 'ACTIVE',
  });

  useEffect(() => {
    adminApi.get<any>(`/careers/${params.id}`)
      .then((item) => {
        setForm({
          title: item.title || '',
          department: item.department || '',
          location: item.location || '',
          type: item.type || '',
          description: item.description || '',
          requirements: item.requirements || '',
          status: item.status || 'ACTIVE',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/careers/${params.id}`, form);
      router.push('/admin/careers');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Career" backHref="/admin/careers" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Department" name="department" value={form.department} onChange={handleChange} />
      <FormField label="Location" name="location" value={form.location} onChange={handleChange} />
      <FormField
        label="Type" name="type" type="select" value={form.type} onChange={handleChange}
        options={[
          { label: 'Full Time', value: 'FULL_TIME' },
          { label: 'Part Time', value: 'PART_TIME' },
          { label: 'Contract', value: 'CONTRACT' },
          { label: 'Volunteer', value: 'VOLUNTEER' },
        ]}
      />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={5} />
      <FormField label="Requirements" name="requirements" type="textarea" value={form.requirements} onChange={handleChange} rows={5} />
      <FormField
        label="Status" name="status" type="select" value={form.status} onChange={handleChange}
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Completed', value: 'COMPLETED' },
        ]}
      />
    </FormCard>
  );
}
