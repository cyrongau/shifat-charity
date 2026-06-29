'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';

interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  email: string;
  order: number;
}

export default function TeamPage() {
  const [data, setData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: TeamMember[] }>(`/team?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/team/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<TeamMember>[] = [
    { key: 'fullName', label: 'Full Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'order', label: 'Order', sortable: true },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/team"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
