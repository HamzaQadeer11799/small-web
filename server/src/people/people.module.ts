import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from '../visits/visit.schema.js';
import { VisitsService } from '../visits/visits.service.js';
import { PeopleController } from './people.controller.js';
import { PeopleService } from './people.service.js';
import { Person, PersonSchema } from './person.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
      { name: Visit.name, schema: VisitSchema },
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService, VisitsService],
  exports: [PeopleService, VisitsService],
})
export class PeopleModule {}
