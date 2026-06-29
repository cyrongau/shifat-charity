'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { formatDate } from '../shared';

interface MailingList {
  id: string;
  name: string;
  description: string;
  _count: { members: number };
  createdAt: string;
}

export default function MailingListsPage() {
  const [data, setData] = useState<MailingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: MailingList[] }>(`/mailing-lists?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/mailing-lists/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<MailingList>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', render: (item) => item.description || '-' },
    {
      key: '_count',
      label: 'Members',
      render: (item) => (
        <span className="font-mono font-bold text-brand-blue">{item._count?.members ?? 0}</span>
      ),
    },
    { key: 'createdAt', label: 'Created', render: (item) => formatDate(item.createdAt) },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/mailing-lists"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
