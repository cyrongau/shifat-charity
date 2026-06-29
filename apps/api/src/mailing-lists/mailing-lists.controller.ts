import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MailingListsService } from './mailing-lists.service';
import { CreateMailingListDto } from './dto/create-mailing-list.dto';
import { UpdateMailingListDto } from './dto/update-mailing-list.dto';
import { FindMailingListsDto } from './dto/find-mailing-lists.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('mailing-lists')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'STAFF')
export class MailingListsController {
  constructor(private readonly mailingListsService: MailingListsService) {}

  @Post()
  create(@Body() dto: CreateMailingListDto) {
    return this.mailingListsService.create(dto);
  }

  @Get()
  findAll(@Query() query: FindMailingListsDto) {
    return this.mailingListsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailingListsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMailingListDto) {
    return this.mailingListsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.mailingListsService.remove(id);
  }

  @Post(':id/subscribers/:subscriberId')
  addSubscriber(@Param('id') id: string, @Param('subscriberId') subscriberId: string) {
    return this.mailingListsService.addSubscriber(id, subscriberId);
  }

  @Delete(':id/members/:memberId')
  removeSubscriber(@Param('id') id: string, @Param('memberId') memberId: string) {
    return this.mailingListsService.removeSubscriber(id, memberId);
  }
}
