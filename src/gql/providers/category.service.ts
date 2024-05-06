import { Injectable } from '@nestjs/common';
import { Category } from '../models';

@Injectable()
export class CategoryService {
  private readonly categories: Category[] = [
    {
      id: '1',
      name: 'Category 1',
    },
    {
      id: '2',
      name: 'Category 2',
    },
    {
      id: '3',
      name: 'Category 3',
    },
  ];

  findAll(): Category[] {
    return this.categories;
  }
}
