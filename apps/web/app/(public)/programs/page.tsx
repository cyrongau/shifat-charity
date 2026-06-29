import type { Metadata } from 'next';
import ProgramsSection from '../../../components/public/ProgramsSection';
import type { Program } from '../../../types';

export const metadata: Metadata = {
  title: 'Our Programs | SHiFAT',
  description: 'Explore SHiFAT\'s six core health programs: Maternal & Child Health, Emergency Relief, Health Education, WASH, Vaccination, and Nutrition.',
};

export default async function ProgramsPage() {
  const res = await fetch('http://localhost:5201/api/programs?limit=50', { cache: 'no-store' });
  const programs: Program[] = (await res.json()).data ?? [];
  return <ProgramsSection programs={programs} />;
}
