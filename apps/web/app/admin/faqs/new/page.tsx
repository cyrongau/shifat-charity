'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function NewFAQ() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    question: '', answer: '', category: '', order: '',
  });

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.post('/faqs', form);
      router.push('/admin/faqs');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create FAQ" backHref="/admin/faqs" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Question" name="question" value={form.question} onChange={handleChange} required />
      <FormField label="Answer" name="answer" type="textarea" value={form.answer} onChange={handleChange} rows={6} />
      <FormField label="Category" name="category" value={form.category} onChange={handleChange} />
      <FormField label="Order" name="order" type="number" value={form.order} onChange={handleChange} />
    </FormCard>
  );
}
