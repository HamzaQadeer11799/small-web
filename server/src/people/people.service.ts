import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person } from './person.schema.js';

export type PersonRow = {
  id: string;
  name: string;
};

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(Person.name) private readonly people: Model<Person>,
  ) {}

  async list(): Promise<PersonRow[]> {
    const rows = await this.people.find().sort({ name: 1 }).lean().exec();
    return rows.map((row) => ({
      id: String(row._id),
      name: row.name,
    }));
  }

  async exists(id: string): Promise<boolean> {
    const row = await this.people.findById(id).select('_id').lean().exec();
    return Boolean(row);
  }

  async require(id: string): Promise<void> {
    if (!(await this.exists(id))) {
      throw new NotFoundException('No such person');
    }
  }
}
