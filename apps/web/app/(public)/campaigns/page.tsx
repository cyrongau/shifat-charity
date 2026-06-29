import type { Metadata } from 'next';
import CampaignsSection from '../../../components/public/CampaignsSection';
import type { Campaign } from '../../../types';

export const metadata: Metadata = {
  title: 'Campaigns | SHiFAT',
  description: 'Support SHiFAT\'s fundraising campaigns and help us deliver critical healthcare services to communities in need.',
};

export default async function CampaignsPage() {
  const res = await fetch('http://localhost:5201/api/campaigns?limit=50', { cache: 'no-store' });
  const campaigns: Campaign[] = (await res.json()).data ?? [];
  return <CampaignsSection campaigns={campaigns} />;
}
