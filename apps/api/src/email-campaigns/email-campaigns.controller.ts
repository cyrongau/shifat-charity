import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EmailCampaignsService } from './email-campaigns.service';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';
import { UpdateEmailCampaignDto } from './dto/update-email-campaign.dto';
import { FindEmailCampaignsDto } from './dto/find-email-campaigns.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('email-campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
export class EmailCampaignsController {
  constructor(private readonly emailCampaignsService: EmailCampaignsService) {}

  @Post()
  create(@Body() dto: CreateEmailCampaignDto) {
    return this.emailCampaignsService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindEmailCampaignsDto) {
    return this.emailCampaignsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailCampaignsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmailCampaignDto) {
    return this.emailCampaignsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.emailCampaignsService.remove(id);
  }

  @Post(':id/send')
  send(@Param('id') id: string) {
    return this.emailCampaignsService.send(id);
  }
}
