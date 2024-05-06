// category.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { Category } from '../models';
import { CategoryService } from '../providers/category.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
