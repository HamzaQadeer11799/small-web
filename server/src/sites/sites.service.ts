import { Injectable, NotFoundException } from '@nestjs/common';
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
}
