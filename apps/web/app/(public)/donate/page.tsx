import type { Metadata } from 'next';
import DonateForm from '../../../components/public/DonateForm';
import type { Program } from '../../../types';

export const metadata: Metadata = {
  title: 'Donate | SHiFAT',
  description: 'Your donation saves lives. Support SHiFAT\'s health programs and make a lasting impact in the Horn of Africa.',
};

export default async function DonatePage() {
  const res = await fetch('http://localhost:5201/api/programs?limit=50', { cache: 'no-store' });
  const programs: Program[] = (await res.json()).data ?? [];
  return <DonateForm programs={programs} />;
}
