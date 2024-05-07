import { PublisherEntity } from '#entity/publisher';
import { Entity, Column, Unique, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
@Entity(process.env.DB_TABLE_CATEGORY)
@Unique(['id', 'name'])
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false, length: 255, name: 'name' })
  name!: string;

  @ManyToMany(() => PublisherEntity, (publisher: PublisherEntity) => publisher.categories)
  @JoinTable(
    {
      name: process.env.DB_TABLE_NEWS,
      joinColumn: {
        name: 'categoryId',
        referencedColumnName: 'id',
      },
      inverseJoinColumn: {
        name: 'publisherId',
        referencedColumnName: 'id',
      },
    }
  )
  publishers!: PublisherEntity[];
}
