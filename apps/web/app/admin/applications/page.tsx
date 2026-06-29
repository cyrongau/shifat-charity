'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge, formatDate } from '../shared';

interface Application {
  id: string;
  fullName: string;
  email: string;
  position: string;
  career?: { title: string };
  status: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: Application[] }>(`/applications?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/applications/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<Application>[] = [
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'position',
      label: 'Position',
      render: (item) => item.career?.title || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
  ];

  return (
    <div>
      <style>{`a[href="/admin/applications/new"] { display: none !important; }`}</style>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Search by name or email..."
        basePath="/admin/applications"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
