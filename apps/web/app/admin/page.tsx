'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/admin-api';
import StatCard from '../../components/admin/StatCard';
import { Heart, Users, DollarSign, Megaphone, Newspaper, Handshake } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  users: number;
  programs: number;
  campaigns: number;
  projects: number;
  news: number;
  publications: number;
  team: number;
  careers: number;
  partners: number;
  donations: number;
  contacts: number;
  applications: number;
  faqs: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.get<any>('/users?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/programs?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/campaigns?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/projects?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/news?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/publications?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/team?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/careers?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/partners?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/donations?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/contacts?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/applications?limit=1').catch(() => ({ meta: { total: 0 } })),
      adminApi.get<any>('/faqs?limit=1').catch(() => ({ meta: { total: 0 } })),
    ]).then(([u, p, c, pr, n, pub, t, ca, pa, d, co, a, f]) => {
      setData({
        users: u.meta?.total ?? 0,
        programs: p.meta?.total ?? 0,
        campaigns: c.meta?.total ?? 0,
        projects: pr.meta?.total ?? 0,
        news: n.meta?.total ?? 0,
        publications: pub.meta?.total ?? 0,
        team: t.meta?.total ?? 0,
        careers: ca.meta?.total ?? 0,
        partners: pa.meta?.total ?? 0,
        donations: d.meta?.total ?? 0,
        contacts: co.meta?.total ?? 0,
        applications: a.meta?.total ?? 0,
        faqs: f.meta?.total ?? 0,
      });
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users"><StatCard label="Users" value={data.users} icon={<Users className="h-5 w-5" />} /></Link>
        <Link href="/admin/programs"><StatCard label="Programs" value={data.programs} icon={<Heart className="h-5 w-5" />} /></Link>
        <Link href="/admin/campaigns"><StatCard label="Campaigns" value={data.campaigns} icon={<Megaphone className="h-5 w-5" />} /></Link>
        <Link href="/admin/projects"><StatCard label="Projects" value={data.projects} icon={<Heart className="h-5 w-5" />} /></Link>
        <Link href="/admin/news"><StatCard label="News" value={data.news} icon={<Newspaper className="h-5 w-5" />} /></Link>
        <Link href="/admin/publications"><StatCard label="Publications" value={data.publications} icon={<Newspaper className="h-5 w-5" />} /></Link>
        <Link href="/admin/partners"><StatCard label="Partners" value={data.partners} icon={<Handshake className="h-5 w-5" />} /></Link>
        <Link href="/admin/donations"><StatCard label="Donations" value={data.donations} icon={<DollarSign className="h-5 w-5" />} /></Link>
        <Link href="/admin/contacts"><StatCard label="Contact Messages" value={data.contacts} icon={<Heart className="h-5 w-5" />} /></Link>
        <Link href="/admin/applications"><StatCard label="Applications" value={data.applications} icon={<Heart className="h-5 w-5" />} /></Link>
      </div>
    </div>
  );
}
