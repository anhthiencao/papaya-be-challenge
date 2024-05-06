import { Injectable } from '@nestjs/common';
import { News } from '../models';
import { NewsCreateInput, NewsUpdateInput } from '../dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from '#entity/news';
import { In, Repository } from 'typeorm';
import { FindAllArgs } from '../common';
import { PaginateBuilder } from '../common/providers';

@Injectable()
export class NewsService {
  constructor(
    @InjectPinoLogger(NewsService.name) private readonly logger: PinoLogger,
    @InjectRepository(NewsEntity) private readonly news: Repository<NewsEntity>,
    private readonly paginateBuilder: PaginateBuilder,
  ) {}

  async findAll(args?: FindAllArgs): Promise<News[]> {
    this.logger.info('findAll news');

    if (!args) {
      return this.news.find();
    }

    const query = this.paginateBuilder.applyFindAllArgs(this.news.createQueryBuilder('news'), args);
    return query.getMany();
  }

  async findById(id: string): Promise<News | null> {
    this.logger.info('findById: ' + id);
    return this.news.findOneBy({ id });
  }

  async create(news: NewsCreateInput): Promise<News> {
    console.log('HEHE')
    const newNews = this.news.create(news);
    return this.news.save(newNews);
  }

  async update(id: string, updatedNews: NewsUpdateInput): Promise<News | null> {
    const news = await this.news.findOneBy({ id });
    if (!news) {
      return Promise.resolve(null);
    }

    Object.assign(news, updatedNews);
    return this.news.save(news);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.news.delete({ id });
    return !!result.affected;
  }

  public async getPublishersByNewsIds(
    newsIds: readonly string[],
  ): Promise<NewsEntity[]> {
    const newsWithPublishers = await this.news.find(
      {
        where: {
          id: In(newsIds),
        },
        relations: ['publisher'],
      }
    )

    return newsWithPublishers
  }

  public async getStudentsFriendsByBatch(
   newsIds: readonly string[],
  ): Promise<(NewsEntity | any)[]> {
    const newsList = await this.getPublishersByNewsIds(newsIds);
    const mappedResults = this._mapResultToIds(newsList);
    return mappedResults;
  }

  private _mapResultToIds(newsList: NewsEntity[]) {
    return newsList.map((news: NewsEntity) => news.publisher);
  }
}
