'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge, formatDate } from '../shared';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: User[] }>(`/users?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/users/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<User>[] = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'fullName', label: 'Full Name', sortable: true },
    {
      key: 'role',
      label: 'Role',
      render: (item) => <StatusBadge status={item.role} />,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="hide-add-new-btn">
      <style>{`a[href="/admin/users/new"] { display: none !important; }`}</style>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Search by email or name..."
        basePath="/admin/users"
        hideActions
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
