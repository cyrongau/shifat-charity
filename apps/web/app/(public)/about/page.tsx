import type { Metadata } from 'next';
import AboutSection from '../../../components/public/AboutSection';
import type { TeamMember } from '../../../types';

export const metadata: Metadata = {
  title: 'About Us | SHiFAT',
  description: 'Learn about SHiFAT\'s mission, values, leadership team, and our commitment to community-led healthcare in the Horn of Africa.',
};

export default async function AboutPage() {
  const res = await fetch('http://localhost:5201/api/team?limit=50', { cache: 'no-store' });
  const team: TeamMember[] = (await res.json()).data ?? [];
  return <AboutSection team={team} />;
}
