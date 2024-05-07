import { Resolver, Query, Args, Mutation, ResolveField, Parent, Context } from '@nestjs/graphql';
import { Category, News, Publisher } from '../models';
import { PublisherService } from '../providers';
import { PublisherCreateInput, PublisherUpdateInput } from '../dto/publisher.input';
import { FindAllArgs } from '../common';
import { IDataloaders } from '../dataloader/dataloader.interface';

@Resolver(() => Publisher)
export class PublisherResolver {
  constructor(
    private readonly publisherService: PublisherService,
  ) {}

  @Query(() => [Publisher])
  public async publishers(@Args() args?: FindAllArgs): Promise<Publisher[]> {
    return this.publisherService.findAll(args);
  }

  @Query(() => Publisher)
  public async publisher(@Args('id') id: string): Promise<Publisher | null> {
    return this.publisherService.findById(id);
  }

  @Mutation(() => Publisher)
  public async createPublisher(@Args('input') publisher: PublisherCreateInput): Promise<Publisher> {
    return this.publisherService.create(publisher);
  }

  @Mutation(() => Publisher)
  public async updatePublisher(@Args('id') id: string, @Args('input') publisher: PublisherUpdateInput): Promise<Publisher | null> {
    return this.publisherService.update(id, publisher);
  }

  @ResolveField(() => [News])
  public async news(@Parent() publisher: Publisher, @Context() { loaders }: { loaders: IDataloaders }): Promise<News[]> {
    const { id } = publisher;

    if (!id) {
      return [];
    }

    return loaders.publishersNewsLoader.load(id);
  }

  @ResolveField(() => [Category])
  public async categories(
    @Parent() publisher: Publisher,
    @Context() { loaders }: { loaders: IDataloaders }
  ): Promise<Category[]> {
    const { id } = publisher;

    if (!id) {
      return [];
    }
    
    return loaders.publishersCategoriesLoader.load(id);
  }
}
