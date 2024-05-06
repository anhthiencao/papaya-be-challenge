import { Injectable } from '@nestjs/common';
import { Category } from '../models';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '#entity/category';
import { Repository } from 'typeorm';
import { CategoryCreateInput, CategoryUpdateInput } from '../dto/category.input';
import { FindAllArgs } from '../common';
import { PaginateBuilder } from '../common/providers';

@Injectable()
export class CategoryService {
  constructor(
    @InjectPinoLogger(CategoryService.name) private readonly logger: PinoLogger,
    @InjectRepository(CategoryEntity) private readonly category: Repository<CategoryEntity>,
	private readonly paginateBuilder: PaginateBuilder,
) {}

  async findAll(args?: FindAllArgs): Promise<Category[]> {
    this.logger.info('findAll categories');
    if (!args) {
      return this.category.find();
    }

	const query = this.paginateBuilder.applyFindAllArgs(this.category.createQueryBuilder('category'), args);
	return query.getMany();
  }


  async findById(id: string): Promise<Category | null> {
    this.logger.info('Find category by id : ' + id);
    return this.category.findOneBy({ id });
  }

  async create(categoryCreateInput: CategoryCreateInput): Promise<Category> {
    const category = new CategoryEntity();
    Object.assign(category, categoryCreateInput);
    return this.category.save(category);
  }
  async update(id: string, categoryUpdateInput: CategoryUpdateInput): Promise<Category | null> {
    const category = await this.category.findOneBy({ id });

    if (!category) {
      return null;
    }

    Object.assign(category, categoryUpdateInput);
    return this.category.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.category.delete(id);
    return !!result.affected;
  }


  
}
