import { Injectable } from '@nestjs/common';
import { Publisher } from '../models';
import { PublisherEntity } from '#entity/publisher';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { PublisherCreateInput, PublisherUpdateInput } from '../dto/publisher.input';
import { FindAllArgs } from '../common';
import { PaginateBuilder } from '../common/providers';
import { NewsEntity } from '#entity/news';
import { CategoryEntity } from '#entity/category';
import type { Config, Models } from 'src/config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PublisherService {
  constructor(
    @InjectPinoLogger(PublisherService.name) private readonly logger: PinoLogger,
    @InjectRepository(PublisherEntity) private readonly publisherRepository: Repository<PublisherEntity>,
    @InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>,
    private readonly configService: ConfigService<Config>,
    private readonly paginateBuilder: PaginateBuilder,
  ) {}

  async findAll(args?: FindAllArgs): Promise<Publisher[]> {
    return args ? this.findAllWithArgs(args) : this.publisherRepository.find();
  }

  private async findAllWithArgs(args: FindAllArgs): Promise<Publisher[]> {
    const queryBuilder = this.publisherRepository.createQueryBuilder(
      this.configService.get<Models>('models')?.publisher || 'publisher',
    );
    this.paginateBuilder.applyFindAllArgs(queryBuilder, args);
    return queryBuilder.getMany();
  }

  async findOne(where: FindOptionsWhere<Publisher>): Promise<Publisher | null> {
    return this.publisherRepository.findOne({ where });
  }

  async findById(id: string): Promise<Publisher | null> {
    this.logger.info(`Fetching publisher by id: ${id}`);
    return this.publisherRepository.findOne({ where: { id } });
  }

  async create(publisherData: PublisherCreateInput): Promise<Publisher> {
    this.logger.info(`Creating publisher: ${publisherData.name}`);
    const publisher = this.publisherRepository.create(publisherData);
    return this.publisherRepository.save(publisher);
  }

  async update(id: string, updateData: PublisherUpdateInput): Promise<Publisher | null> {
    const existingPublisher = await this.publisherRepository.findOneBy({ id });
    if (!existingPublisher) {
      return null;
    }
    const updatedPublisher = this.publisherRepository.merge(existingPublisher, updateData);
    return this.publisherRepository.save(updatedPublisher);
  }

  async getNewsByPublisherIds(publisherIds: readonly string[]): Promise<NewsEntity[]> {
    return this.newsRepository.find({
      where: { publisherId: In(publisherIds) },
    });
  }

  async getNewsByPublisherIdsBatching(publisherIds: readonly string[]): Promise<NewsEntity[][]> {
    const newsList = await this.getNewsByPublisherIds(publisherIds);
    return this.mapNewsListByPublisherId(publisherIds, newsList);
  }

  private mapNewsListByPublisherId(publisherIds: readonly string[], newsList: NewsEntity[]): NewsEntity[][] {
    return publisherIds.map((publisherId) => newsList.filter((news) => news.publisherId === publisherId));
  }

  public async getCategoriesByPublisherIds(publisherIds: readonly string[]): Promise<(CategoryEntity | any)[]> {
    const publishersWithCategories = await this.publisherRepository.find({
      where: {
        id: In(publisherIds),
      },
      relations: ['categories'],
    });

    return publishersWithCategories.map((publisher) => publisher.categories);
  }
}
