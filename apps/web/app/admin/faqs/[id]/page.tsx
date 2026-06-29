'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function EditFAQ() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    question: '', answer: '', category: '', order: '',
  });

  useEffect(() => {
    adminApi.get<any>(`/faqs/${params.id}`)
      .then((item) => {
        setForm({
          question: item.question || '',
          answer: item.answer || '',
          category: item.category || '',
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
      await adminApi.patch(`/faqs/${params.id}`, form);
      router.push('/admin/faqs');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard title="Edit FAQ" backHref="/admin/faqs" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Question" name="question" value={form.question} onChange={handleChange} required />
      <FormField label="Answer" name="answer" type="textarea" value={form.answer} onChange={handleChange} rows={6} />
      <FormField label="Category" name="category" value={form.category} onChange={handleChange} />
      <FormField label="Order" name="order" type="number" value={form.order} onChange={handleChange} />
    </FormCard>
  );
}
