import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleModule } from '../people/people.module.js';
import { Person, PersonSchema } from '../people/person.schema.js';
import { Site, SiteSchema } from './site.schema.js';
import { SitesController } from './sites.controller.js';
import { SitesService } from './sites.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: Person.name, schema: PersonSchema },
    ]),
    PeopleModule,
  ],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
