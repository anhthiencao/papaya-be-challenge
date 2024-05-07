import DataLoader from 'dataloader';
import { Category, News, Publisher  } from '../models';

export interface IDataloaders {
  newsPublishersLoader: DataLoader<string, Publisher>;
  newsCategoriesLoader: DataLoader<string, Category>;
  publishersNewsLoader: DataLoader<string, News[]>;
  publishersCategoriesLoader: DataLoader<string, Category[]>;
  categoriesNewsLoader: DataLoader<string, News[]>;
  categoriesPublishersLoader: DataLoader<string, Publisher[]>;
}
