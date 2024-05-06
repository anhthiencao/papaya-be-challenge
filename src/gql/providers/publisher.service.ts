import { Injectable } from '@nestjs/common';
import { Publisher } from '../models';
import { PublisherEntity } from '#entity/publisher';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PublisherCreateInput, PublisherUpdateInput } from '../dto/publisher.input';
import { FindAllArgs } from '../common';
import { PaginateBuilder } from '../common/providers';

@Injectable()
export class PublisherService {
  constructor(
    @InjectPinoLogger(PublisherService.name) private readonly logger: PinoLogger,
    @InjectRepository(PublisherEntity) private readonly publisherRepository: Repository<PublisherEntity>,
    private readonly paginateBuilder: PaginateBuilder,
  ) {}

  async findAll(args?: FindAllArgs): Promise<Publisher[]> {
    this.logger.info('Fetching all publishers');
    if (!args) {
      return this.publisherRepository.find();
    }
  
    const query = this.paginateBuilder.applyFindAllArgs(this.publisherRepository.createQueryBuilder('publisher'), args);
    return query.getMany()
  }


  async findOne(where: FindOptionsWhere<Publisher>): Promise<Publisher | null> {
    return this.publisherRepository.findOne({ where });
  }

  async findById(id: string): Promise<Publisher | null> {
    this.logger.info('Fetching publisher by id: ' + id);
    return this.publisherRepository.findOne({ where: { id } });
  }

  async create(publisher: PublisherCreateInput): Promise<Publisher> {
    this.logger.info('Creating publisher: ' + publisher.name);
    return this.publisherRepository.save(publisher);
  }

  async update(id: string, publisher: PublisherUpdateInput): Promise<Publisher | null> {
    this.logger.info('Updating publisher: ' + id);
    const publisherToUpdate = await this.publisherRepository.findOneBy({ id });
    if (!publisherToUpdate) {
      return null;
    }
    Object.assign(publisherToUpdate, publisher);
    return this.publisherRepository.save(publisher);
  }

}
