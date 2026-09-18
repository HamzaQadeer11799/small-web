import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VISIT_WAYS, Visit, VisitWay } from './visit.schema.js';

export type VisitRow = {
  address: string;
  at: string;
  via: VisitWay;
};

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private readonly visits: Model<Visit>,
  ) {}

  async listForPerson(personId: string): Promise<VisitRow[]> {
    const id = this.asId(personId);
    const rows = await this.visits
      .find({ person: id })
      .sort({ at: -1 })
      .lean()
      .exec();

    return rows.map((row) => ({
      address: row.address,
      at: row.at.toISOString(),
      via: row.via,
    }));
  }

  async record(input: {
    personId: string;
    address: string;
    via: string;
  }): Promise<VisitRow> {
    const person = this.asId(input.personId);
    const address = input.address.trim().toLowerCase();
    if (!address) {
      throw new BadRequestException('Address is required');
    }
    if (!VISIT_WAYS.includes(input.via as VisitWay)) {
      throw new BadRequestException('Unknown visit way');
    }

    const via = input.via as VisitWay;
    const created = await this.visits.create({
      person,
      address,
      via,
      at: new Date(),
    });

    return {
      address: created.address,
      at: created.at.toISOString(),
      via: created.via,
    };
  }

  private asId(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new NotFoundException('No such person');
    }
    return new Types.ObjectId(value);
  }
}
