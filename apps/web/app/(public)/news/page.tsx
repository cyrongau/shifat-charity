import type { Metadata } from 'next';
import NewsSection from '../../../components/public/NewsSection';
import type { NewsItem } from '../../../types';

export const metadata: Metadata = {
  title: 'News & Updates | SHiFAT',
  description: 'Read the latest updates, campaign stories, emergency responses, and announcements from SHiFAT.',
};

export default async function NewsPage() {
  const res = await fetch('http://localhost:5201/api/news?limit=50', { cache: 'no-store' });
  const newsItems: NewsItem[] = (await res.json()).data ?? [];
  return <NewsSection newsItems={newsItems} />;
}
