export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  iconName: string;
  imageUrl: string;
  impactStat: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  status: 'Active' | 'Completed' | 'Upcoming';
  targetAmount: string;
  currentRaised: string;
  progressPercentage: number;
  region: string;
  startDate: string;
  endDate?: string;
  imageUrl: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  programId: string;
  title: string;
  description: string;
  location: string;
  status: 'Completed' | 'Ongoing' | 'Planned';
  imageUrl: string;
  beneficiaries: string;
  isActive: boolean;
  program?: { id: string; title: string; slug: string };
}

export interface NewsItem {
  id: string;
  authorId: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Update' | 'Campaign' | 'Emergency' | 'Announcement';
  imageUrl: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  author?: { id: string; fullName: string; email: string };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  category: 'Leadership' | 'Medical' | 'Advisory';
  sortOrder: number;
}

export interface CareerOpportunity {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'VOLUNTEER';
  description: string;
  requirements: string[];
  isActive: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  type: 'INTERNATIONAL_NGO' | 'GOVERNMENT' | 'LOCAL_TRUST' | 'CORPORATE_DONOR';
  logoBg: string;
  sortOrder: number;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  category: 'ANNUAL_REPORT' | 'RESEARCH_PAPER' | 'FIELD_REPORT' | 'TRAINING_GUIDE' | 'POLICY_BRIEF';
  fileUrl: string;
  pages: string;
  isPublished: boolean;
  publicationDate: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
}
