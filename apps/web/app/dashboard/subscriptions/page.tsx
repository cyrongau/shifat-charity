'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { RefreshCw, XCircle } from 'lucide-react';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!user?.id) return;
    const token = localStorage.getItem('shifat_token');
    setLoading(true);
    fetch('http://localhost:5201/api/donations?limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const all = data.data || [];
        setSubscriptions(all.filter((d: any) => d.frequency === 'MONTHLY'));
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this recurring donation?')) return;
    setCancelling(id);
    const token = localStorage.getItem('shifat_token');
    try {
      await fetch(`http://localhost:5201/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'REFUNDED' }),
      });
      load();
    } catch (err) { console.error(err); }
    finally { setCancelling(null); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal">My Subscriptions</h1>
        <p className="text-sm text-gray-500">Manage your recurring monthly donations.</p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <RefreshCw className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No active recurring donations</p>
          <p className="text-sm text-gray-400 mt-1">Set up a monthly donation to provide ongoing support.</p>
          <Link href="/donate" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 brand-gradient text-white rounded-lg text-sm font-medium">Start a Monthly Donation</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub: any) => (
            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center"><RefreshCw className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <div className="font-bold text-brand-charcoal">${Number(sub.amount).toFixed(2)}/month</div>
                  <div className="text-xs text-gray-500">{sub.designation || 'General Donation'}{sub.campaign && ` · ${sub.campaign.title}`}</div>
                  <div className="text-[11px] text-gray-400 font-mono">Since {new Date(sub.createdAt).toLocaleDateString()} · {sub.paymentMethod}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${sub.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{sub.status}</span>
                {sub.status !== 'REFUNDED' && (
                  <button onClick={() => handleCancel(sub.id)} disabled={cancelling === sub.id} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer">
                    <XCircle className="h-3.5 w-3.5" />{cancelling === sub.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
