import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Category, News, Publisher } from '../models';
import { PublisherService } from '../providers';
import { PublisherCreateInput, PublisherUpdateInput } from '../dto/publisher.input';
import { FindAllArgs, Operator } from '../common';
import { NewsService } from '../providers/news.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublisherEntity } from '#entity/publisher';

@Resolver(() => Publisher)
export class PublisherResolver {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly newsService: NewsService,
    @InjectRepository(PublisherEntity) private readonly publisherRepository: Repository<PublisherEntity>,
  ) {}

  @Query(() => [Publisher])
  public async publishers(@Args('args', { nullable: true, defaultValue: {} }) args?: FindAllArgs): Promise<Publisher[]> {
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
  public async news(@Parent() publisher: Publisher): Promise<News[]> {
    return this.newsService.findAll({
      filters: [
        {
          key: 'publisherId',
          operator: Operator.eq,
          values: [publisher.id],
        },
      ],
    });
  }

  @ResolveField(() => [Category])
  public async categories(@Parent() publisher: Publisher): Promise<Category[]> {
    const publisherWithCategories = await this.publisherRepository.findOne({
      where: { id: publisher.id },
      relations: ['categories'],
    });

    return publisherWithCategories?.categories ?? [];
  }
}
