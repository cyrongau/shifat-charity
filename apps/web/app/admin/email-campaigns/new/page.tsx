'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function NewEmailCampaign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    subject: '', content: '', targetType: 'ALL_SUBSCRIBERS', mailingListId: '',
  });

  useEffect(() => {
    adminApi.get<{ data: any[] }>('/mailing-lists?limit=100')
      .then((res) => setLists(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload: any = { subject: form.subject, content: form.content, targetType: form.targetType };
      if (form.targetType === 'MAILING_LIST' && form.mailingListId) {
        payload.mailingListId = form.mailingListId;
      }
      await adminApi.post('/email-campaigns', payload);
      router.push('/admin/email-campaigns');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Create Email Campaign" backHref="/admin/email-campaigns" onSubmit={handleSubmit} loading={loading}>
      {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
      <FormField label="Subject" name="subject" value={form.subject} onChange={handleChange} required />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Target</label>
        <select
          value={form.targetType}
          onChange={(e) => handleChange('targetType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
        >
          <option value="ALL_SUBSCRIBERS">All Subscribers</option>
          <option value="MAILING_LIST">Specific Mailing List</option>
        </select>
      </div>

      {form.targetType === 'MAILING_LIST' && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Mailing List</label>
          <select
            value={form.mailingListId}
            onChange={(e) => handleChange('mailingListId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none"
          >
            <option value="">Select a list...</option>
            {lists.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      <FormField
        label="Email Content (HTML)"
        name="content"
        type="textarea"
        value={form.content}
        onChange={handleChange}
        rows={12}
        placeholder="<h1>Your email content here...</h1>"
        required
      />
      <p className="text-[10px] text-gray-400 -mt-2">
        Write your email in HTML format. You can use inline styles for email clients.
      </p>
    </FormCard>
  );
}
