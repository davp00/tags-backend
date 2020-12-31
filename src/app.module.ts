import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_URI } from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GqlModule } from './gql/gql.module';

/**
 * Module in charge of importing
 * all the resources and functionalities necessary for the application to be executed correctly
 */
@Module({
  imports: [
    MongooseModule.forRoot(MONGO_DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.graphql'),
    }),
    GqlModule,
  ],
})
export class AppModule {}
