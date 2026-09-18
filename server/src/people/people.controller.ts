import { Controller, Get, Param } from '@nestjs/common';
import { VisitsService } from '../visits/visits.service.js';
import { PeopleService } from './people.service.js';

@Controller('people')
export class PeopleController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly visitsService: VisitsService,
  ) {}

  @Get()
  list() {
    return this.peopleService.list();
  }

  @Get(':personId/history')
  async history(@Param('personId') personId: string) {
    await this.peopleService.require(personId);
    return this.visitsService.listForPerson(personId);
  }
}
