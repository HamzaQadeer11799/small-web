import { Module } from '@nestjs/common';
import { PeopleModule } from '../people/people.module.js';
import { VisitsController } from './visits.controller.js';

@Module({
  imports: [PeopleModule],
  controllers: [VisitsController],
})
export class VisitsModule {}
