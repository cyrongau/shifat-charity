'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import { StatusBadge, formatDate } from '../shared';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  campaign?: { title: string };
  status: string;
  createdAt: string;
}

export default function DonationsPage() {
  const [data, setData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.get<{ data: Donation[] }>(`/donations?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns: Column<Donation>[] = [
    { key: 'donorName', label: 'Donor Name', sortable: true },
    { key: 'donorEmail', label: 'Email', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (item) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.amount)),
    },
    {
      key: 'campaign',
      label: 'Campaign',
      render: (item) => item.campaign?.title || '-',
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
      <style>{`a[href="/admin/donations/new"] { display: none !important; }`}</style>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Search by donor name..."
        basePath="/admin/donations"
        hideActions
      />
    </div>
  );
}
