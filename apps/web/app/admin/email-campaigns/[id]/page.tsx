'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';

export default function EditEmailCampaign() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    adminApi.get<any>(`/email-campaigns/${params.id}`)
      .then((item) => {
        setForm({
          subject: item.subject || '',
          content: item.content || '',
          targetType: item.targetType || 'ALL_SUBSCRIBERS',
          mailingListId: item.mailingListId || '',
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload: any = { subject: form.subject, content: form.content, targetType: form.targetType };
      if (form.targetType === 'MAILING_LIST' && form.mailingListId) {
        payload.mailingListId = form.mailingListId;
      } else {
        payload.mailingListId = null;
      }
      await adminApi.patch(`/email-campaigns/${params.id}`, payload);
      router.push('/admin/email-campaigns');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!confirm('Send this campaign now?')) return;
    setLoading(true);
    try {
      await adminApi.post(`/email-campaigns/${params.id}/send`, {});
      router.push('/admin/email-campaigns');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <FormCard
      title="Edit Email Campaign"
      backHref="/admin/email-campaigns"
      onSubmit={handleSubmit}
      loading={loading}
      extraButtons={
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Send Now
        </button>
      }
    >
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
    </FormCard>
  );
}
