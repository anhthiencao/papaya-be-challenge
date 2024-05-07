import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IDataloaders } from './dataloader.interface';
import { NewsService } from '../providers/news.service';
import { Category, News, Publisher } from '../models';
import { PublisherService } from '../providers';
import { CategoryService } from '../providers/category.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly newsService: NewsService,
    private readonly publisherService: PublisherService,
    private readonly categoryService: CategoryService
  ) {}

  getLoaders(): IDataloaders {
    const newsPublishersLoader = this._createNewsPublishersLoader();
    const newsCategoriesLoader = this._createNewsCategoriesLoader();
    const publishersNewsLoader = this._createPublishersNewsLoader();
    const publishersCategoriesLoader = this._createPublishersCategoriesLoader();
    const categoriesNewsLoader = this._createCategoriesNewsLoader();
    const categoriesPublishersLoader = this._createCategoriesPublishersLoader();

    return {
      newsPublishersLoader,
      newsCategoriesLoader,
      publishersNewsLoader,
      publishersCategoriesLoader,
      categoriesNewsLoader,
      categoriesPublishersLoader
    };
  }

  private _createNewsPublishersLoader() {
    return new DataLoader<string, Publisher>(
      async (keys: readonly string[]) =>
        await this.newsService.getPublishersByNewsIdsBatching(keys),
    );
  }

  private _createNewsCategoriesLoader() {
    return new DataLoader<string, Category>(
      async (keys: readonly string[]) =>
        await this.newsService.getCategoriesByNewsIdsBatching(keys),
    );
  }

  private _createPublishersNewsLoader() {
    return new DataLoader<string, News[]>(
      async (keys: readonly string[]) =>
        await this.publisherService.getNewsByPublisherIdsBatching(keys),
    );
  }

  private _createPublishersCategoriesLoader() {
    return new DataLoader<string, Category[]>(
      async (keys: readonly string[]) =>
        await this.publisherService.getCategoriesByPublisherIds(keys),
    );
  }

  private _createCategoriesNewsLoader() {
    return new DataLoader<string, News[]>(
      async (keys: readonly string[]) =>
        await this.categoryService.getNewsByCategoryIdsBatching(keys),
    );
  }

  private _createCategoriesPublishersLoader() {
    return new DataLoader<string, Publisher[]>(
      async (keys: readonly string[]) =>
        await this.categoryService.getPublishersByCategoriesIds(keys),
    );
  }

}