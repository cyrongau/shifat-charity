'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { StatusBadge } from '../shared';

interface NewsItem {
  id: string;
  title: string;
  author: { id: string; fullName: string; email: string };
  category: string;
  status: string;
  publishedAt: string;
}

export default function NewsPage() {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: NewsItem[] }>(`/news?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/news/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<NewsItem>[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'author', label: 'Author', sortable: true, render: (item) => item.author?.fullName || item.author?.email || '-' },
    { key: 'category', label: 'Category', sortable: true },
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
        basePath="/admin/news"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
