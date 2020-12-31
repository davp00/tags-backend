import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagResolver } from './resolvers/tag.resolver';
import { TagModel, AutoIncrementModel } from '../models';
import { TagService } from '../services/tag/tag.service';
import { AutoIncrementService } from '../services/autoincrement/autoincrement.service';
import { PubSub } from 'graphql-subscriptions';

/**
 * To provide the pubsub class to resolvers and services
 */
const PUB_SUB_SERVICE = {
  provide: 'PUB_SUB',
  useValue: new PubSub(),
};

/**
 * Module in charge of importing, providing
 * all the necessary functionalities for the correct functioning of Graphql actions
 */
@Module({
  imports: [MongooseModule.forFeature([TagModel, AutoIncrementModel])],
  providers: [TagResolver, TagService, AutoIncrementService, PUB_SUB_SERVICE],
  exports: [PUB_SUB_SERVICE],
})
export class GqlModule {}
