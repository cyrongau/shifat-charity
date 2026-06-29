'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function NewMailingList() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/mailing-lists', form);
      router.push('/admin/mailing-lists');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Mailing List" backHref="/admin/mailing-lists" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} />
    </FormCard>
  );
}
