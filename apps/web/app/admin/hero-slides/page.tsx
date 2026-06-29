'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import DeleteModal from '../../../components/admin/DeleteModal';
import { truncate } from '../shared';

interface HeroSlide {
  id: string;
  page: string;
  title: string | null;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export default function HeroSlidesPage() {
  const [data, setData] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.get<{ data: HeroSlide[] }>(`/hero-slides?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminApi.delete(`/hero-slides/${deleteId}`);
    setDeleteId(null);
    load();
  };

  const columns: Column<HeroSlide>[] = [
    {
      key: 'page', label: 'Page', sortable: true,
      render: (item) => (
        <span className="capitalize">{item.page}</span>
      ),
    },
    { key: 'title', label: 'Title', render: (item) => truncate(item.title || '(no title)', 40) },
    {
      key: 'imageUrl', label: 'Image',
      render: (item) => (
        <img src={item.imageUrl} alt="" className="h-10 w-16 rounded object-cover border" />
      ),
    },
    { key: 'sortOrder', label: 'Order', sortable: true },
    {
      key: 'isActive', label: 'Active',
      render: (item) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        basePath="/admin/hero-slides"
        onDelete={(id) => setDeleteId(id)}
      />
      <DeleteModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />
    </div>
  );
}
