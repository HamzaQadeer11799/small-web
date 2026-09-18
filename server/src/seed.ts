import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppModule } from './app.module.js';
import { Person } from './people/person.schema.js';
import { PEOPLE, SITES, VISITS } from './seed.data.js';
import { Site } from './sites/site.schema.js';
import { Visit } from './visits/visit.schema.js';

const STARTED_AT = new Date('2026-09-17T09:00:00.000Z');

async function seed() {
  const logger = new Logger('seed');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const people = app.get<Model<Person>>(getModelToken(Person.name));
  const sites = app.get<Model<Site>>(getModelToken(Site.name));
  const visits = app.get<Model<Visit>>(getModelToken(Visit.name));

  const personIds = new Map<string, Types.ObjectId>();

  for (const name of PEOPLE) {
    const person = await people.findOneAndUpdate(
      { name },
      { $set: { name } },
      { upsert: true, returnDocument: 'after' },
    );
    personIds.set(name, person._id as Types.ObjectId);
  }

  for (const site of SITES) {
    const author = personIds.get(site.author);
    if (!author) {
      throw new Error(`Missing author ${site.author}`);
    }
    await sites.findOneAndUpdate(
      { address: site.address },
      {
        $set: {
          address: site.address,
          title: site.title,
          body: site.body,
          author,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  await visits.deleteMany({});
  await visits.insertMany(
    VISITS.map((visit) => {
      const person = personIds.get(visit.person);
      if (!person) {
        throw new Error(`Missing person ${visit.person}`);
      }
      return {
        person,
        address: visit.address,
        via: visit.via,
        at: new Date(STARTED_AT.getTime() + visit.minutes * 60 * 1000),
      };
    }),
  );

  logger.log(
    `Seed complete: ${PEOPLE.length} people, ${SITES.length} sites, ${VISITS.length} visits.`,
  );

  await app.close();
}

await seed();
