'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function EditPartner() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', logo: '', website: '', order: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/partners/${params.id}`)
      .then((item) => {
        setForm({
          name: item.name || '',
          description: item.description || '',
          logo: item.logo || '',
          website: item.website || '',
          order: item.order ?? '',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/partners/${params.id}`, form);
      router.push('/admin/partners');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Partner" backHref="/admin/partners" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={5} />
      <FormField label="Website" name="website" type="url" value={form.website} onChange={handleChange} />
      <FormField label="Order" name="order" type="number" value={form.order} onChange={handleChange} />
      <ImageUpload label="Logo" value={form.logo} onChange={(url) => handleChange('logo', url)} />
    </FormCard>
  );
}
