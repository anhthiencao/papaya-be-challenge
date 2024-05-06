import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sampletable1 } from '#entity/sampledb1';
import { PublisherService, SimpleService } from './providers';
import { SimpleResolver } from './resolvers';
import { DateScalar } from './scalars';
import { AuthResolver } from './resolvers/auth.resolver';
import { PublisherResolver } from './resolvers/publisher.resolver';
import { NewsResolver } from './resolvers/news.resolver';
import { NewsService } from './providers/news.service';
import { CategoryService } from './providers/category.service';
import { CategoryResolver } from './resolvers/category.resolver';

/**
 * https://docs.nestjs.com/graphql/quick-start
 */
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: (config: ConfigService) => ({
        ...config.get<GqlModuleOptions>('graphql'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Sampletable1]),
  ],
  providers: [
    SimpleResolver, SimpleService,
    DateScalar, AuthResolver,
    PublisherResolver, PublisherService,
    NewsResolver, NewsService,
    CategoryResolver, CategoryService
  ],
})
export class GqlModule {}
