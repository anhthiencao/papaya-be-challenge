import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { NewsService } from '../providers/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '#entity/news';
import { PaginateBuilder } from '../common/providers';
import { PublisherService } from '../providers';
import { CategoryService } from '../providers/category.service';
import { PublisherEntity } from '#entity/publisher';
import { CategoryEntity } from '#entity/category';

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity, PublisherEntity, CategoryEntity])],
  providers: [DataloaderService, NewsService, PublisherService, CategoryService, PaginateBuilder],
  exports: [DataloaderService],
})
export class DataloaderModule {}
