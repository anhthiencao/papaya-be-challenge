import { Injectable } from '@nestjs/common';

import type { User } from './user.interface';
import { Publisher } from 'src/gql/models';

const publishers = [
  {
    id: '1',
    name: 'Publisher 1',
    username: 'publisher1',
    password: 'password1',
  },
  {
    id: '2',
    name: 'Publisher 2',
    username: 'publisher2',
    password: 'password2',
  },
  {
    id: '3',
    name: 'Publisher 3',
    username: 'publisher3',
    password: 'password3',
  },
];

@Injectable()
export class UserService {
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
    return Promise.resolve(publishers.find((p) => p.username === username && p.password === password) || null);
  }
}
