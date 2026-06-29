import type { Metadata } from 'next';
import PartnersSection from '../../../components/public/PartnersSection';
import type { Partner } from '../../../types';

export const metadata: Metadata = {
  title: 'Partners | SHiFAT',
  description: 'Meet the international NGOs, government agencies, local trusts, and corporate donors supporting SHiFAT\'s work.',
};

export default async function PartnersPage() {
  const res = await fetch('http://localhost:5201/api/partners?limit=50', { cache: 'no-store' });
  const partners: Partner[] = (await res.json()).data ?? [];
  return <PartnersSection partners={partners} />;
}
