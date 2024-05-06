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
import { NewsEntity } from '#entity/news';
import { CategoryEntity } from '#entity/category';
import { PublisherEntity } from '#entity/publisher';
import { PaginateBuilder } from './common/providers';
import { DataloaderService } from './dataloader/dataloader.service'; // Import DataloaderService
import { DataloaderModule } from './dataloader/dataloader.module';

@Module({
  imports: [
    DataloaderModule,
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      useFactory: async (
        config: ConfigService, 
        dataloaderService: DataloaderService // Inject DataloaderService
      ) => ({
        ...config.get<GqlModuleOptions>('graphql'),
        autoSchemaFile: true,
        context: () => ({
          loaders: dataloaderService.getLoaders(), // Use DataloaderService to get loaders
        }),
      }),
      inject: [ConfigService, DataloaderService], // Inject DataloaderService
    }),
    TypeOrmModule.forFeature([Sampletable1, NewsEntity, CategoryEntity, PublisherEntity]),
  ],
  providers: [
    SimpleResolver, 
    SimpleService,
    DateScalar, 
    AuthResolver,
    PublisherResolver, 
    PublisherService,
    NewsResolver, 
    NewsService,
    CategoryResolver, 
    CategoryService,
    PaginateBuilder,
  ],
})
export class GqlModule {}
