import { Controller, Get, Param, Query } from '@nestjs/common';
import { SitesService } from './sites.service.js';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  search(@Query('q') q?: string) {
    return this.sitesService.search(q ?? '');
  }

  @Get(':address')
  findByAddress(@Param('address') address: string) {
    return this.sitesService.findByAddress(address);
  }
}
