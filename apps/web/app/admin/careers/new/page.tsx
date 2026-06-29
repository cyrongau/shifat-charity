'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function NewCareer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', department: '', location: '', type: '',
    description: '', requirements: '', status: 'ACTIVE',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/careers', form);
      router.push('/admin/careers');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Career" backHref="/admin/careers" onSubmit={handleSubmit} loading={loading}>
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
