'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { adminApi } from '../../../lib/admin-api';
import DataTable from '../../../components/admin/DataTable';
import type { Column } from '../../../components/admin/DataTable';
import { formatDate, truncate } from '../shared';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    adminApi.get<{ data: Contact[] }>(`/contacts?search=${search}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns: Column<Contact>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'subject',
      label: 'Subject',
      render: (item) => truncate(item.subject, 40),
    },
    {
      key: 'isRead',
      label: 'Read',
      render: (item) =>
        item.isRead ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-gray-300" />
        ),
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
      <style>{`a[href="/admin/contacts/new"] { display: none !important; }`}</style>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onSearch={setSearch}
        searchValue={search}
        searchPlaceholder="Search by name, email or subject..."
        basePath="/admin/contacts"
        hideActions
      />
    </div>
  );
}
