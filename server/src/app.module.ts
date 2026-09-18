import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Person, PersonSchema } from './people/person.schema.js';
import { Site, SiteSchema } from './sites/site.schema.js';
import { Visit, VisitSchema } from './visits/visit.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') ??
          'mongodb://localhost:27017/small-web',
      }),
    }),
    MongooseModule.forFeature([
      { name: Person.name, schema: PersonSchema },
      { name: Site.name, schema: SiteSchema },
      { name: Visit.name, schema: VisitSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
