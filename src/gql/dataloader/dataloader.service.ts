import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IDataloaders } from './dataloader.interface';
import { NewsService } from '../providers/news.service';
import { Publisher } from '../models';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  getLoaders(): IDataloaders {
    const publishersLoader = this._createPublishersLoader();
    return {
      publishersLoader,
    };
  }

  private _createPublishersLoader() {
    return new DataLoader<string, Publisher>(
      async (keys: readonly string[]) =>
        await this.newsService.getStudentsFriendsByBatch(keys as string[]),
    );
  }
}