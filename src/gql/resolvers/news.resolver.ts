import { Resolver, Query, Mutation, Args, ResolveField, Parent, Context } from '@nestjs/graphql';
import { Category, News, Payload, Publisher } from '../models';
import { NewsService } from '../providers/news.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard, OwnerNewsGuard } from 'src/auth';
import { NewsCreateInput, NewsUpdateInput } from '../dto/news.input';
import { FindAllArgs, Operator } from '../common';
import { IDataloaders } from '../dataloader/dataloader.interface';
import { ReqUser } from 'src/common';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Query(() => [News], { nullable: true })
  async news(@Args() args?: FindAllArgs): Promise<News[]> {
    return this.newsService.findAll(args);
  }

  @Query(() => News, { nullable: true })
  async newsDetail(@Args('id') id: string): Promise<News | null> {
    return this.newsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [News], { nullable: true })
  async myNews(@ReqUser() user: Payload): Promise<News[]> {
    return this.newsService.findAll({
      filters: [
        {
          key: 'publisherId',
          operator: Operator.eq,
          values: [user.userId],
        },
      ],
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => News)
  async createNews(
    @Args('input') newsCreateInput: NewsCreateInput,
    @ReqUser() user: Payload
  ): Promise<News> {
    newsCreateInput.publisherId = user.userId
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

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() news: News, @Context() { loaders }: { loaders: IDataloaders }): Promise<Category | null> {
    const { id } = news;

    if (!id) {
      return null;
    }

    return loaders.newsCategoriesLoader.load(id);
  }

  @ResolveField(() => Publisher)
  async publisher(@Parent() news: News, @Context() { loaders }: { loaders: IDataloaders }): Promise<Publisher | null> {
    const { id } = news;

    if (!id) {
      return null;
    }

    return loaders.newsPublishersLoader.load(id);
  }
}
