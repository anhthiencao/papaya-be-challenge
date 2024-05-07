import { Injectable } from '@nestjs/common';
import { Category } from '../models';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '#entity/category';
import { In, Repository } from 'typeorm';
import { CategoryCreateInput, CategoryUpdateInput } from '../dto/category.input';
import { FindAllArgs } from '../common';
import { PaginateBuilder } from '../common/providers';
import { NewsEntity } from '#entity/news';
import { PublisherEntity } from '#entity/publisher';
import type { Config, Models } from 'src/config';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CategoryService {
  constructor(
    @InjectPinoLogger(CategoryService.name) private readonly logger: PinoLogger,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(NewsEntity) private readonly newsRepository: Repository<NewsEntity>,
    private readonly configService: ConfigService<Config>,
    private readonly paginateBuilder: PaginateBuilder,
) {}

  async findAll(args?: FindAllArgs): Promise<Category[]> {
    this.logger.info('findAll categories');
    if (!args) {
      return this.categoryRepository.find();
    }

	const query = this.paginateBuilder.applyFindAllArgs(this.categoryRepository.createQueryBuilder(
    this.configService.get<Models>('models')?.category || 'category',
  ), args);
	return query.getMany();
  }


  async findById(id: string): Promise<Category | null> {
    this.logger.info('Find category by id : ' + id);
    return this.categoryRepository.findOneBy({ id });
  }

  async create(categoryCreateInput: CategoryCreateInput): Promise<Category> {
    const category = new CategoryEntity();
    Object.assign(category, categoryCreateInput);
    return this.categoryRepository.save(category);
  }
  async update(id: string, categoryUpdateInput: CategoryUpdateInput): Promise<Category | null> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      return null;
    }

    Object.assign(category, categoryUpdateInput);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return !!result.affected;
  }

  public async getNewsByCategoriesIds(categoryIds: readonly string[]): Promise<(NewsEntity | any)[]> {
    const news = await this.newsRepository.find({
      where: {
        categoryId: In(categoryIds),
      },
    });
    return news;
  }

  public async getNewsByCategoryIdsBatching(categoryIds: readonly string[]): Promise<(NewsEntity | any)[]> {
    const newsList = await this.getNewsByCategoriesIds(categoryIds);
    const mappedResults = this._mapNewsListByCategoryId(categoryIds, newsList);
    return mappedResults;
  }

  private _mapNewsListByCategoryId(categoryIds: readonly string[], newsList: NewsEntity[]) {
    return categoryIds.map((categoryId) => newsList.filter((news) => news.categoryId === categoryId));
  }

  public async getPublishersByCategoriesIds(categoryIds: readonly string[]): Promise<(PublisherEntity | any)[]> {
    const categoriesWithPublishers = await this.categoryRepository.find({
      where: {
        id: In(categoryIds),
      },
      relations: ['publishers'],
    });

    return categoriesWithPublishers.map((category) => category.publishers);
  }
  
}
