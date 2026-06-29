import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDto } from './dto/search.dto';

const DEFAULT_TYPES = ['programs', 'projects', 'campaigns', 'news', 'publications', 'careers', 'faqs', 'team', 'announcements', 'gallery'] as const;

const SEARCH_FIELDS: Record<string, string[]> = {
  programs: ['title', 'description'],
  projects: ['title', 'description'],
  campaigns: ['title', 'description'],
  news: ['title', 'excerpt'],
  publications: ['title', 'description'],
  careers: ['title', 'description', 'department'],
  faqs: ['question', 'answer'],
  team: ['name', 'bio'],
  announcements: ['title', 'content'],
  gallery: ['title', 'description'],
};

type SearchType = keyof typeof SEARCH_FIELDS;

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: SearchDto) {
    const searchTerm = query.search || '';
    const types = (query.types?.length ? query.types : DEFAULT_TYPES) as SearchType[];

    const searchJobs = types.map((type) => this.searchType(type, searchTerm));
    const results = await Promise.all(searchJobs);

    const grouped: Record<string, any[]> = {};
    types.forEach((type, i) => {
      grouped[type] = results[i];
    });

    return { results: grouped };
  }

  private searchType(type: SearchType, term: string) {
    if (!term) {
      return this.getDelegate(type).findMany({ take: 5 });
    }

    const fields = SEARCH_FIELDS[type];
    const where = {
      OR: fields.map((field) => ({
        [field]: { contains: term, mode: 'insensitive' as const },
      })),
    };

    return this.getDelegate(type).findMany({ where, take: 5 });
  }

  private getDelegate(type: SearchType) {
    const delegates: Record<SearchType, { findMany: (args?: any) => Promise<any[]> }> = {
      programs: this.prisma.program,
      projects: this.prisma.project,
      campaigns: this.prisma.campaign,
      news: this.prisma.newsItem,
      publications: this.prisma.publication,
      careers: this.prisma.careerOpportunity,
      faqs: this.prisma.faq,
      team: this.prisma.teamMember,
      announcements: this.prisma.announcement,
      gallery: this.prisma.galleryItem,
    };
    return delegates[type];
  }
}
