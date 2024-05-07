import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NewsService } from 'src/gql/providers/news.service';

@Injectable()
export class OwnerNewsGuard implements CanActivate {
  constructor(private readonly newsService: NewsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { id } = ctx.getArgs();
    const { user } = ctx.getContext().req;

    return this.isUserNewsPublisher(id, user.userId);
  }

  private async isUserNewsPublisher(newsId: string, publisherId: string): Promise<boolean> {
    const newsItem = await this.newsService.findById(newsId);
    return newsItem ? newsItem.publisherId === publisherId : false;
  }
}
