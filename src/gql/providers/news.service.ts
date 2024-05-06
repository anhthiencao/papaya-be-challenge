import { Injectable } from '@nestjs/common';
import { News } from '../models';
import { NewsUpdateInput } from '../dto';

@Injectable()
export class NewsService {
  private readonly news: News[] = [
    {
      id: '1',
      title: 'News 1',
      content: 'Content 1',
      categoryId: '1',
      publisherId: '1',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'News 2',
      content: 'Content 2',
      categoryId: '2',
      publisherId: '2',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'News 3',
      content: 'Content 3',
      categoryId: '3',
      publisherId: '3',
      createdAt: new Date(),
    },
  ];

  findAll(): Promise<News[]> {
    return Promise.resolve(this.news);
  }

  findById(id: string): Promise<News | undefined> {
    return Promise.resolve(this.news.find((news) => news.id === id));
  }

  create(news: News): Promise<News> {
    this.news.push(news);

    return Promise.resolve(news);
  }

  update(id: string, updatedNews: NewsUpdateInput): Promise<News | null> {
    const index = this.news.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.news[index] = { ...this.news[index], ...updatedNews };
      return Promise.resolve(this.news[index]);
    }

    return Promise.resolve(null);
  }

  remove(id: string): Promise<boolean> {
    const index = this.news.findIndex((item) => item.id === id);

    if (index !== -1) {
      this.news.splice(index, 1);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }
}
