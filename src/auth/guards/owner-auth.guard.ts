import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NewsService } from 'src/gql/providers/news.service';

@Injectable()
export class OwnerNewsGuard implements CanActivate {
  constructor(private readonly newsService: NewsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { id } = ctx.getArgs(); // Assuming the news id is passed as an argument
	const { user } = ctx.getContext().req;
	const news = await this.newsService.findById(id);

    // Check if the news exists
    if (!news) {
      return false;
    }

    // Check if the user is the publisher of the news
    if (news.publisherId !== user.userId) {
      return false;
    }

    return true;
  }
}

