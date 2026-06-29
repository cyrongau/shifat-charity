'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';

interface Partner {
  id: string;
  name: string;
  website: string;
  order: number;
}

export default function PartnersPage() {
  const [data, setData] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: Partner[] }>(`/partners?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/partners/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<Partner>[] = [
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'website',
      label: 'Website',
      render: (item) =>
        item.website ? (
          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
            {item.website}
          </a>
        ) : (
          '-'
        ),
    },
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
        basePath="/admin/partners"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
