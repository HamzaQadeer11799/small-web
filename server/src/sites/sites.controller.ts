import { Controller, Get, Param } from '@nestjs/common';
import { SitesService } from './sites.service.js';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get(':address')
  findByAddress(@Param('address') address: string) {
    return this.sitesService.findByAddress(address);
  }
}
