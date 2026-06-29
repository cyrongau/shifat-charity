'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import ImageUpload from '../../../../components/admin/ImageUpload';

export default function EditTeam() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', role: '', bio: '', image: '', email: '', order: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/team/${params.id}`)
      .then((item) => {
        setForm({
          fullName: item.fullName || '',
          role: item.role || '',
          bio: item.bio || '',
          image: item.image || '',
          email: item.email || '',
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
      await adminApi.patch(`/team/${params.id}`, form);
      router.push('/admin/team');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit Team Member" backHref="/admin/team" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
      <FormField label="Role" name="role" value={form.role} onChange={handleChange} />
      <FormField label="Bio" name="bio" type="textarea" value={form.bio} onChange={handleChange} rows={5} />
      <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <FormField label="Order" name="order" type="number" value={form.order} onChange={handleChange} />
      <ImageUpload label="Image" value={form.image} onChange={(url) => handleChange('image', url)} />
    </FormCard>
  );
}
