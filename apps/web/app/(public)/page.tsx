import Hero from '../../components/public/Hero';
import ImpactStats from '../../components/public/ImpactStats';
import ProgramsSection from '../../components/public/ProgramsSection';
import CampaignsSection from '../../components/public/CampaignsSection';
import NewsSection from '../../components/public/NewsSection';
import PartnersSection from '../../components/public/PartnersSection';
import type { Program, Campaign, NewsItem, Partner } from '../../types';

export default async function HomePage() {
  const [programsRes, campaignsRes, newsRes, partnersRes] = await Promise.all([
    fetch('http://localhost:5201/api/programs?limit=6', { cache: 'no-store' }),
    fetch('http://localhost:5201/api/campaigns?limit=4', { cache: 'no-store' }),
    fetch('http://localhost:5201/api/news?limit=3', { cache: 'no-store' }),
    fetch('http://localhost:5201/api/partners?limit=6', { cache: 'no-store' }),
  ]);

  const programs: Program[] = (await programsRes.json()).data ?? [];
  const campaigns: Campaign[] = (await campaignsRes.json()).data ?? [];
  const newsItems: NewsItem[] = (await newsRes.json()).data ?? [];
  const partners: Partner[] = (await partnersRes.json()).data ?? [];

  return (
    <>
      <Hero />
      <ImpactStats />
      <ProgramsSection programs={programs} />
      <CampaignsSection campaigns={campaigns} />
      <NewsSection newsItems={newsItems} />
      <PartnersSection partners={partners} />
    </>
  );
}
