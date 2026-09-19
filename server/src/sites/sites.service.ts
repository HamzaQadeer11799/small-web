import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person } from '../people/person.schema.js';
import { Site } from './site.schema.js';

export type SitePage = {
  address: string;
  title: string;
  body: string;
  authorName: string;
};

export type SearchHit = {
  address: string;
  title: string;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly sites: Model<Site>,
  ) {}

  async findByAddress(rawAddress: string): Promise<SitePage> {
    const address = rawAddress.trim().toLowerCase();
    const site = await this.sites
      .findOne({ address })
      .populate<{ author: Person | null }>('author', 'name')
      .lean()
      .exec();

    if (!site) {
      throw new NotFoundException(`No such address: ${address}`);
    }

    const authorName =
      site.author && typeof site.author === 'object' && 'name' in site.author
        ? site.author.name
        : 'Unknown';

    return {
      address: site.address,
      title: site.title,
      body: site.body,
      authorName,
    };
  }

  async search(raw: string): Promise<SearchHit[]> {
    const q = raw.trim();
    if (!q) {
      throw new BadRequestException('Search text is required');
    }

    const pattern = new RegExp(escapeRegex(q), 'i');
    const rows = await this.sites
      .find({ $or: [{ title: pattern }, { body: pattern }] })
      .sort({ address: 1 })
      .lean()
      .exec();

    return rows.map((row) => ({
      address: row.address,
      title: row.title,
    }));
  }
}
