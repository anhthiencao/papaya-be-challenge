// publisher.service.ts
import { Injectable } from '@nestjs/common';
import { Publisher } from '../models';

@Injectable()
export class PublisherService {
  private readonly publishers: Publisher[] = [
    {
        id: '1',
        name: 'Publisher 1',
       
      },
      {
        id: '2',
        name: 'Publisher 2',
       
      },
      {
        id: '3',
        name: 'Publisher 3',
      
      },
    // Add more publishers as needed
  ];

  findAll(): Publisher[] {
    return this.publishers;
  }
}
