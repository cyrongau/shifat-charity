'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge, formatDate } from '../shared';
import { Download } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export default function NewsletterPage() {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: Subscriber[] }>(`/newsletter?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/newsletter/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const handleExportCsv = () => {
    const token = localStorage.getItem('shifat_token');
    const link = document.createElement('a');
    link.href = `http://localhost:5201/api/newsletter/export/csv?token=${token}`;
    link.download = 'subscribers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: Column<Subscriber>[] = [
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'subscribedAt',
      label: 'Subscribed',
      sortable: true,
      render: (item) => formatDate(item.subscribedAt),
    },
    {
      key: 'active',
      label: 'Status',
      render: (item) => <StatusBadge status={item.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
  ];

  return (
    <div>
      <style>{`a[href="/admin/newsletter/new"] { display: none !important; }`}</style>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div />
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Search by email..."
        basePath="/admin/newsletter"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
