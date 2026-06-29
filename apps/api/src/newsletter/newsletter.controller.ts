import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { FindNewsletterDto } from './dto/find-newsletter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  subscribe(@Body() dto: CreateNewsletterDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findAll(@Query() query: FindNewsletterDto) {
    return this.newsletterService.findAll(query);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="subscribers.csv"')
  async exportCsv(@Res() res: Response) {
    const csv = await this.newsletterService.exportCsv();
    res.send(csv);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  toggleActive(@Param('id') id: string) {
    return this.newsletterService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }
}
