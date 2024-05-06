// publisher.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { Publisher } from '../models';
import { PublisherService } from '../providers';

@Resolver(() => Publisher)
export class PublisherResolver {
  constructor(private readonly publisherService: PublisherService) {}

  @Query(() => [Publisher])
  public async publishers(): Promise<Publisher[]> {
    return this.publisherService.findAll();
  }


}
