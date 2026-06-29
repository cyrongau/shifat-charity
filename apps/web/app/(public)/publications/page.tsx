import type { Metadata } from 'next';
import PublicationsSection from '../../../components/public/PublicationsSection';
import type { Publication } from '../../../types';

export const metadata: Metadata = {
  title: 'Publications | SHiFAT',
  description: 'Browse SHiFAT\'s annual reports, research papers, field reports, training guides, and policy briefs.',
};

export default async function PublicationsPage() {
  const res = await fetch('http://localhost:5201/api/publications?limit=50', { cache: 'no-store' });
  const publications: Publication[] = (await res.json()).data ?? [];
  return <PublicationsSection publications={publications} />;
}
