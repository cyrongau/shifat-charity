'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { Heart, DollarSign, TrendingUp, ArrowRight, Receipt } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('shifat_token');

    fetch('http://localhost:5201/api/donations?limit=5', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((donationsData) => {
        const donations = donationsData.data || [];
        setRecentDonations(donations.slice(0, 5));
        const total = donations.reduce((sum: number, d: any) => sum + Number(d.amount), 0);
        const recurring = donations.filter((d: any) => d.frequency === 'MONTHLY').length;
        setStats({ totalDonated: total, donationCount: donations.length, lastDonation: donations[0] || null, recurringCount: recurring });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
      </div>
    );
  }

  const initials = (user?.fullName || user?.email || 'U').split(' ').map((s) => s.charAt(0)).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full brand-gradient flex items-center justify-center text-lg font-bold text-white">{initials}</div>
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">Welcome, {user?.fullName?.split(' ')[0] || 'Donor'}</h1>
          <p className="text-sm text-gray-500">Here&apos;s your giving impact at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-green">
            <DollarSign className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Donated</span>
          </div>
          <p className="text-2xl font-bold font-display text-brand-charcoal">${stats?.totalDonated.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-blue">
            <Heart className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Donations</span>
          </div>
          <p className="text-2xl font-bold font-display text-brand-charcoal">{stats?.donationCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-500">
            <TrendingUp className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Recurring</span>
          </div>
          <p className="text-2xl font-bold font-display text-brand-charcoal">{stats?.recurringCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-500">
            <Receipt className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Last Donation</span>
          </div>
          <p className="text-lg font-bold font-display text-brand-charcoal truncate">{stats?.lastDonation ? `$${Number(stats.lastDonation.amount).toFixed(2)}` : '—'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-display font-bold text-brand-charcoal">Recent Donations</h2>
          <Link href="/dashboard/donations" className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentDonations.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">
            <Heart className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No donations yet</p>
            <Link href="/donate" className="text-xs text-brand-blue hover:underline mt-1 inline-block">Make your first donation</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentDonations.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between px-6 py-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${d.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    ${Number(d.amount).toFixed(0)}
                  </div>
                  <div>
                    <div className="font-medium text-brand-charcoal">{d.designation || 'General Donation'}</div>
                    <div className="text-[11px] text-gray-400">{new Date(d.createdAt).toLocaleDateString()} · {d.paymentMethod}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${d.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : d.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {d.status}
                  </span>
                  {d.receiptId && <Link href={`/receipt/${d.receiptId}`} className="text-[10px] text-brand-blue hover:underline font-mono">Receipt</Link>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
