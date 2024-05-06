import DataLoader from 'dataloader';
import { Publisher  } from '../models';

export interface IDataloaders {
  publishersLoader: DataLoader<string, Publisher>;
  // categoriesLoader: DataLoader<string, Category>;
  // newsLoader: DataLoader<string, News>;
}
