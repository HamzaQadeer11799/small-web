import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export const VISIT_WAYS = [
  'typed',
  'link',
  'back',
  'forward',
  'history',
  'search',
] as const;

export type VisitWay = (typeof VISIT_WAYS)[number];

export type VisitDocument = HydratedDocument<Visit>;

@Schema({ collection: 'visits' })
export class Visit {
  @Prop({ type: Types.ObjectId, ref: 'Person', required: true })
  person: Types.ObjectId;

  @Prop({ required: true, trim: true, lowercase: true })
  address: string;

  @Prop({ required: true })
  at: Date;

  @Prop({ required: true, enum: VISIT_WAYS })
  via: VisitWay;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);

VisitSchema.index({ person: 1, at: -1 });
