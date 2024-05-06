import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { NewsService } from '../providers/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '#entity/news';
import { PaginateBuilder } from '../common/providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([ NewsEntity ])
  ],
  providers: [DataloaderService, NewsService, PaginateBuilder],
  exports: [DataloaderService],
})
export class DataloaderModule {}
