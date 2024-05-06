import { Injectable } from '@nestjs/common';

import type { User } from './user.interface';
import { Publisher } from 'src/gql/models';

import { InjectRepository } from '@nestjs/typeorm';
import { PublisherEntity } from '#entity/publisher';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(PublisherEntity)
    private readonly publisher: Repository<PublisherEntity>,
  ) {}
  public async fetch(username: string): Promise<User & { password: string }> {
    return Promise.resolve({
      id: 'test',
      password: 'crypto',
      name: username,
      email: `${username}@test.com`,
      roles: ['test'], // ['admin', 'etc', ...]
    });
  }

  public async fetchPublisher(username: string, password: string): Promise<Publisher | null> {
    return this.publisher.findOne({
      where: {
        username,
        password
      }
    })
  }
}
