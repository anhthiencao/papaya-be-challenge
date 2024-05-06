// news.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { News } from '../models';
import { NewsService } from '../providers/news.service';
import { UseGuards } from '@nestjs/common';
import { OwnerNewsGuard } from 'src/auth';
import { NewsUpdateInput } from '../dto/news.input';
// import { UseGuards } from '@nestjs/common';
// import { OwnerAuthGuard } from 'src/auth/guards/owner-auth.guard';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Query(() => [News])
  async news(): Promise<News[]> {
    return this.newsService.findAll();
  }

//   @Mutation(() => News)
//   async createNews(
//     @Args('title') title: string,
//     @Args('content') content: string,
//   ): Promise<News> {
//     return this.newsService.create(title, content, user.publisherId);
//   }

  @Mutation(() => News)
  @UseGuards(OwnerNewsGuard)
  async updateNews(
    @Args('id') id: string,
    @Args('input') updateNews: NewsUpdateInput,
  ): Promise<News | null> {
    return this.newsService.update(id, updateNews);
  }

  @Mutation(() => Boolean)
  @UseGuards(OwnerNewsGuard)
  async removeNews(
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.newsService.remove(id);
  }
}
