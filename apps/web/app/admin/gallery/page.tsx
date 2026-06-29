'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { truncate } from '../shared';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function GalleryPage() {
  const [data, setData] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: GalleryItem[] }>(`/gallery?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/gallery/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<GalleryItem>[] = [
    {
      key: 'imageUrl', label: 'Image',
      render: (item) => (
        <img src={item.imageUrl} alt={item.title} className="h-10 w-14 rounded object-cover" />
      ),
    },
    { key: 'title', label: 'Title', render: (item) => truncate(item.title, 50) },
    { key: 'category', label: 'Category' },
    {
      key: 'isFeatured', label: 'Featured',
      render: (item) => item.isFeatured ? <span className="text-amber-500 font-bold">★</span> : '—',
    },
    {
      key: 'isActive', label: 'Active',
      render: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Created', render: (item) => new Date(item.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/gallery"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
