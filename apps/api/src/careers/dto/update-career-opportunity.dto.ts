import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerOpportunityDto } from './create-career-opportunity.dto';

export class UpdateCareerOpportunityDto extends PartialType(CreateCareerOpportunityDto) {}
