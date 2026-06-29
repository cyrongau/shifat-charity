import type { Metadata } from 'next';
import VolunteerForm from '../../../components/public/VolunteerForm';
import type { CareerOpportunity } from '../../../types';

export const metadata: Metadata = {
  title: 'Get Involved | SHiFAT',
  description: 'Join SHiFAT\'s mission — volunteer, explore career opportunities, and make a difference in community healthcare.',
};

export default async function GetInvolvedPage() {
  const res = await fetch('http://localhost:5201/api/careers?limit=50', { cache: 'no-store' });
  const careers: CareerOpportunity[] = (await res.json()).data ?? [];
  return <VolunteerForm careers={careers} />;
}
