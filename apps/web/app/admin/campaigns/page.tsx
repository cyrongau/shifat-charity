'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge } from '../shared';

interface Campaign {
  id: string;
  title: string;
  category: string;
  goal: number;
  raised: number;
  status: string;
  startDate: string;
  endDate: string;
}

export default function CampaignsPage() {
  const [data, setData] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: Campaign[] }>(`/campaigns?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/campaigns/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<Campaign>[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'goal',
      label: 'Goal',
      render: (item) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.goal)),
    },
    {
      key: 'raised',
      label: 'Raised',
      render: (item) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.raised)),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: 'startDate', label: 'Start Date', sortable: true, render: (item) => new Date(item.startDate).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', sortable: true, render: (item) => new Date(item.endDate).toLocaleDateString() },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/campaigns"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
