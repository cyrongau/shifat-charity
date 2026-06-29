'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge, formatDate } from '../shared';

interface EmailCampaign {
  id: string;
  subject: string;
  status: string;
  targetType: string;
  mailingList: { id: string; name: string } | null;
  sentAt: string | null;
  createdAt: string;
}

export default function EmailCampaignsPage() {
  const [data, setData] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: EmailCampaign[] }>(`/email-campaigns?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/email-campaigns/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const handleSend = async (id: string) => {
    if (!confirm('Send this campaign now?')) return;
    await adminApi.post(`/email-campaigns/${id}/send`, {});
    load();
  };

  const columns: Column<EmailCampaign>[] = [
    { key: 'subject', label: 'Subject', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
          item.status === 'SENT' ? 'bg-emerald-50 text-emerald-700' :
          item.status === 'SCHEDULED' ? 'bg-blue-50 text-blue-700' :
          'bg-amber-50 text-amber-700'
        }`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'targetType',
      label: 'Target',
      render: (item) => (
        <span className="text-xs">
          {item.targetType === 'ALL_SUBSCRIBERS' ? 'All Subscribers' : item.mailingList?.name || 'List'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'sentAt',
      label: 'Sent',
      render: (item) => item.sentAt ? formatDate(item.sentAt) : '-',
    },
  ];

  const actions = (item: EmailCampaign) => (
    <div className="flex items-center gap-1">
      {item.status === 'DRAFT' && (
        <button
          onClick={() => handleSend(item.id)}
          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors text-[10px] font-bold"
          title="Send now"
        >
          Send
        </button>
      )}
      <Link
        href={`/admin/email-campaigns/${item.id}`}
        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-blue-50 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={() => setDeleteId(item.id)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/email-campaigns"
        hideActions
      />
      <div className="mt-4">
        {data.map((item) => (
          <div key={item.id} className="hidden">
            {item.status === 'DRAFT' && (
              <button onClick={() => handleSend(item.id)} />
            )}
          </div>
        ))}
      </div>
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
