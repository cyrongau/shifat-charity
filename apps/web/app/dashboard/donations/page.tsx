'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { Search, ArrowUpDown } from 'lucide-react';

interface Donation {
  id: string; amount: number; currency: string; frequency: string;
  designation: string; paymentMethod: string; status: string;
  receiptId: string; transactionRef: string | null; isAnonymous: boolean;
  createdAt: string; campaign: { id: string; title: string } | null;
}

export default function DonationHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const load = useCallback(() => {
    if (!user?.id) return;
    const token = localStorage.getItem('shifat_token');
    setLoading(true);
    fetch(`http://localhost:5201/api/donations?search=${search}&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setDonations(data.data || []))
      .finally(() => setLoading(false));
  }, [search, user?.id]);

  useEffect(() => { load(); }, [load]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sorted = [...donations].sort((a, b) => {
    let aVal: any = a[sortKey as keyof Donation], bVal: any = b[sortKey as keyof Donation];
    if (sortKey === 'amount') { aVal = Number(a.amount); bVal = Number(b.amount); }
    if (sortKey === 'createdAt') { aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); }
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort(field)}>
      <span className="flex items-center gap-1">{label}<ArrowUpDown className={`h-3 w-3 ${sortKey === field ? 'text-brand-green' : ''}`} /></span>
    </th>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal">Donation History</h1>
        <p className="text-sm text-gray-500">View all your past donations and download receipts.</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by designation, receipt..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <SortHeader label="Date" field="createdAt" />
                <SortHeader label="Amount" field="amount" />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                <SortHeader label="Status" field="status" />
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400"><div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-green border-t-transparent" /></td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400"><p className="font-medium">No donations found</p></td></tr>
              ) : (
                sorted.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono text-[13px]">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm font-bold text-brand-charcoal font-mono">${Number(d.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>{d.designation || 'General'}</div>
                      {d.campaign && <div className="text-[11px] text-brand-blue">{d.campaign.title}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${d.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : d.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{d.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{d.paymentMethod}</td>
                    <td className="px-4 py-3">{d.receiptId && <Link href={`/receipt/${d.receiptId}`} className="text-xs text-brand-blue hover:underline font-mono">View Receipt</Link>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
