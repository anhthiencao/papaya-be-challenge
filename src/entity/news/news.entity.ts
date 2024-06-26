import { CategoryEntity } from '#entity/category';
import { PublisherEntity } from '#entity/publisher';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
@Entity(process.env.DB_TABLE_NEWS)
@Unique(['title'])
export class NewsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false, length: 255, name: 'title' })
  title!: string;

  @Column('text', { nullable: true, name: 'content' })
  content?: string;

  @ManyToOne(() => PublisherEntity)
  @JoinColumn({ name: 'publisherId' })
  publisher?: PublisherEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category?: CategoryEntity;

  @Column({ type: 'uuid', default: '1' })
  publisherId?: string;

  @Column({ type: 'uuid' })
  categoryId!: string;

  @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP', name: 'createdAt' })
  createdAt!: Date;
}
