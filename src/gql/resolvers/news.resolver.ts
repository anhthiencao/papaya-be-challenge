import { Resolver, Query, Mutation, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { Category, News, Payload, Publisher } from '../models';
import { NewsService } from '../providers/news.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, OwnerNewsGuard } from 'src/auth';
import { NewsCreateInput, NewsUpdateInput } from '../dto/news.input';
import { CategoryService } from '../providers/category.service';
import { ReqUser } from 'src/common';
import { FindAllArgs } from '../common';
import { IDataloaders } from '../dataloader/dataloader.interface';

@Resolver(() => News)
export class NewsResolver {
  constructor(
    private readonly newsService: NewsService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query(() => [News])
  async news(@Args('args', { nullable: true }) args?: FindAllArgs): Promise<News[]> {
    return this.newsService.findAll(args);
  }

  @Query(() => News)
  async newsDetail(@Args('id') id: string): Promise<News | null> {
    return this.newsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => News)
  async myNews(@ReqUser() user: Payload): Promise<News[]> {
    return this.newsService.findAll({
      filters: [
        {
          key: 'publisherId',
          values: [user.userId],
        },
      ],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => News)
  async createNews(@Args('input') newsCreateInput: NewsCreateInput): Promise<News> {
    return this.newsService.create(newsCreateInput);
  }

  @Mutation(() => News)
  @UseGuards(JwtAuthGuard, OwnerNewsGuard)
  async updateNews(@Args('id') id: string, @Args('input') newsCreateInput: NewsUpdateInput): Promise<News | null> {
    return this.newsService.update(id, newsCreateInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, OwnerNewsGuard)
  async removeNews(@Args('id') id: string): Promise<boolean> {
    return this.newsService.remove(id);
  }

  @ResolveField(() => Category)
  async category(@Parent() news: News): Promise<Category | null> {
    if (!news.categoryId) {
      return null;
    }
    return this.categoryService.findById(news.categoryId);
  }

  @ResolveField(() => Publisher)
  async publisher(@Parent() news: News, @Context() { loaders }: { loaders: IDataloaders }): Promise<Publisher | null> {
    const { id } = news;

    if (!id) {
      return null;
    }

    return loaders.publishersLoader.load(id);
  }
}
