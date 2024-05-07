import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Category, News, Publisher } from '../models';
import { CategoryService } from '../providers/category.service';
import { CategoryCreateInput, CategoryUpdateInput } from '../dto/category.input';
import { NewsService } from '../providers/news.service';
import { FindAllArgs, Operator } from '../common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '#entity/category';
import { Repository } from 'typeorm';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly newsService: NewsService,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  @Query(() => [Category])
  async categories(@Args() args?: FindAllArgs): Promise<Category[]> {
    return this.categoryService.findAll(args);
  }

  @Query(() => Category)
  async category(@Args('id') id: string): Promise<Category | null> {
    return this.categoryService.findById(id);
  }

  @Mutation(() => Category)
  async createCategory(@Args('input') input: CategoryCreateInput): Promise<Category> {
    return this.categoryService.create(input);
  }

  @Mutation(() => Category)
  async updateCategory(@Args('id') id: string, @Args('input') input: CategoryUpdateInput): Promise<Category | null> {
    return this.categoryService.update(id, input);
  }

  @ResolveField(() => [News])
  public async news(@Parent() category: Category): Promise<News[]> {
    return this.newsService.findAll({
      filters: [
        {
          key: 'categoryId',
          operator: Operator.eq,
          values: [category.id],
        },
      ],
    });
  }

  @ResolveField(() => [Publisher])
  public async publishers(@Parent() category: Category): Promise<Publisher[]> {
    const categoryWithPublishers = await this.categoryRepository.findOne({
      where: { id: category.id },
      relations: ['publishers'],
    });

    return categoryWithPublishers?.publishers ?? [];
  }
}
