import { Injectable } from '@nestjs/common';
import { News } from '../models';
import { NewsCreateInput, NewsUpdateInput } from '../dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from '#entity/news';
import { In, Repository } from 'typeorm';
import { FindAllArgs } from '../common';
import { PaginateBuilder } from '../common/providers';
import { ConfigService } from '@nestjs/config';
import type { Config, Models } from 'src/config';

@Injectable()
export class NewsService {
  constructor(
    @InjectPinoLogger(NewsService.name) private readonly logger: PinoLogger,
    @InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>,
    private readonly paginateBuilder: PaginateBuilder,
    private readonly configService: ConfigService<Config>,
  ) {}

  async findAll(args?: FindAllArgs): Promise<News[]> {
    if (args) {
      const newsQueryBuilder = this.newsRepository.createQueryBuilder(this.configService.get<Models>('models')?.news || 'news');
      const paginatedQuery = this.paginateBuilder.applyFindAllArgs(newsQueryBuilder, args);
      return paginatedQuery.getMany();
    }
    return this.newsRepository.find();
  }

  async findById(id: string): Promise<News | null> {
    this.logger.info('findById: ' + id);
    return this.newsRepository.findOneBy({ id });
  }

  async create(news: NewsCreateInput): Promise<News> {
    const newNews = this.newsRepository.create(news);
    return this.newsRepository.save(newNews);
  }

  async update(newsId: string, updatePayload: NewsUpdateInput): Promise<News | null> {
    const existingNews = await this.newsRepository.findOneBy({ id: newsId });
    if (!existingNews) {
      return null;
    }

    Object.assign(existingNews, updatePayload);
    return this.newsRepository.save(existingNews);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.newsRepository.delete({ id });
    return !!result.affected;
  }

  public async getPublishersByNewsIds(newsIds: readonly string[]): Promise<NewsEntity[]> {
    const newsWithPublishers = await this.newsRepository.find({
      where: {
        id: In(newsIds),
      },
      relations: [this.configService.get<Models>('models')?.publisher || 'publisher'],
    });

    return newsWithPublishers;
  }

  public async getPublishersByNewsIdsBatching(newsIds: readonly string[]): Promise<(NewsEntity | any)[]> {
    const newsList = await this.getPublishersByNewsIds(newsIds);
    const mappedResults = this._mapPublishers(newsList);
    return mappedResults;
  }

  private _mapPublishers(newsList: NewsEntity[]) {
    return newsList.map((news: NewsEntity) => news.publisher);
  }

  public async getNewsWithCategoriesByNewsIds(newsIds: readonly string[]): Promise<NewsEntity[]> {
    const newsWithCategories = await this.newsRepository.find({
      where: {
        id: In(newsIds),
      },
      relations: [this.configService.get<Models>('models')?.category || 'category'],
    });

    return newsWithCategories;
  }

  public async getCategoriesByNewsIdsBatching(newsIds: readonly string[]): Promise<(NewsEntity | any)[]> {
    const newsList = await this.getNewsWithCategoriesByNewsIds(newsIds);
    const mappedResults = this._mapCategories(newsList);
    return mappedResults;
  }

  private _mapCategories(newsList: NewsEntity[]) {
    return newsList.map((news: NewsEntity) => news.category);
  }
}
