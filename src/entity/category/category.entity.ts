import { PublisherEntity } from '#entity/publisher';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Entity(process.env.DB_TABLE_CATEGORY)
@Unique(['name'])
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToMany(() => PublisherEntity, (publisher) => publisher.categories)
  @JoinTable(
    {
      name: process.env.DB_TABLE_CATEGORY,
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
