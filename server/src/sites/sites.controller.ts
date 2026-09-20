import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PeopleService } from '../people/people.service.js';
import { SitesService } from './sites.service.js';

@Controller('sites')
export class SitesController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly sitesService: SitesService,
  ) {}

  @Get()
  search(@Query('q') q?: string) {
    return this.sitesService.search(q ?? '');
  }

  @Post()
  async publish(
    @Body()
    body: {
      personId?: string;
      address?: string;
      body?: string;
    },
  ) {
    const personId = body.personId ?? '';
    await this.peopleService.require(personId);
    return this.sitesService.publish({
      personId,
      address: body.address ?? '',
      body: body.body ?? '',
    });
  }

  @Get(':address')
  findByAddress(@Param('address') address: string) {
    return this.sitesService.findByAddress(address);
  }
}
