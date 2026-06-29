'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function NewCampaign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: '', image: '', goal: '',
    raised: '', status: 'ACTIVE', startDate: '', endDate: '',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/campaigns', form);
      router.push('/admin/campaigns');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Campaign" backHref="/admin/campaigns" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={5} />
      <FormField label="Category" name="category" value={form.category} onChange={handleChange} />
      <FormField label="Goal" name="goal" type="number" value={form.goal} onChange={handleChange} />
      <FormField
        label="Status" name="status" type="select" value={form.status} onChange={handleChange}
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Draft', value: 'DRAFT' },
        ]}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        <FormField label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
      </div>
      <ImageUpload label="Image URL" value={form.image} onChange={(url) => handleChange('image', url)} />
    </FormCard>
  );
}
