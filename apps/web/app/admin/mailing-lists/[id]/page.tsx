'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import FormCard from '../../../../components/admin/FormCard';
import FormField from '../../../../components/admin/FormField';
import { Users, Trash2 } from 'lucide-react';

export default function EditMailingList() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '' });
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    adminApi.get<any>(`/mailing-lists/${params.id}`)
      .then((item) => {
        setForm({ name: item.name || '', description: item.description || '' });
        setMembers(item.members || []);
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (name: string, value: string) => setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await adminApi.patch(`/mailing-lists/${params.id}`, form);
      router.push('/admin/mailing-lists');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await adminApi.delete(`/mailing-lists/${params.id}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <FormCard title="Edit Mailing List" backHref="/admin/mailing-lists" onSubmit={handleSubmit} loading={loading}>
        {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} rows={3} />
      </FormCard>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-brand-blue" />
          <h2 className="text-lg font-display font-bold text-brand-charcoal">Members ({members.length})</h2>
        </div>
        {members.length === 0 ? (
          <p className="text-sm text-gray-400">No members in this list yet.</p>
        ) : (
          <div className="space-y-2">
            {members.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-brand-charcoal">{member.subscriber?.email}</span>
                  <span className="ml-2 text-[10px] text-gray-400 font-mono">
                    Added {new Date(member.addedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
