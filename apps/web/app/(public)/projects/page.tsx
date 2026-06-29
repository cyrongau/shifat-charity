import type { Metadata } from 'next';
import ProjectsSection from '../../../components/public/ProjectsSection';
import type { Project } from '../../../types';

export const metadata: Metadata = {
  title: 'Projects | SHiFAT',
  description: 'Discover SHiFAT\'s completed, ongoing, and planned health projects across the Horn of Africa.',
};

export default async function ProjectsPage() {
  const res = await fetch('http://localhost:5201/api/projects?limit=50', { cache: 'no-store' });
  const projects: Project[] = (await res.json()).data ?? [];
  return <ProjectsSection projects={projects} />;
}
