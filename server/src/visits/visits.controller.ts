import { Body, Controller, Post } from '@nestjs/common';
import { PeopleService } from '../people/people.service.js';
import { VisitsService } from './visits.service.js';

@Controller('visits')
export class VisitsController {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly visitsService: VisitsService,
  ) {}

  @Post()
  async record(
    @Body()
    body: {
      personId?: string;
      address?: string;
      via?: string;
    },
  ) {
    const personId = body.personId ?? '';
    await this.peopleService.require(personId);
    return this.visitsService.record({
      personId,
      address: body.address ?? '',
      via: body.via ?? '',
    });
  }
}
