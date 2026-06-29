'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge } from '../shared';

interface Publication {
  id: string;
  title: string;
  author: string;
  type: string;
  status: string;
  publishedAt: string;
}

export default function PublicationsPage() {
  const [data, setData] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: Publication[] }>(`/publications?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/publications/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<Publication>[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'author', label: 'Author', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: 'publishedAt', label: 'Published', sortable: true, render: (item) => item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-' },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/publications"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
