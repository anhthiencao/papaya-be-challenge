import { CategoryEntity } from '#entity/category';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
@Entity(process.env.DB_TABLE_PUBLISHER)
@Unique(['username'])
export class PublisherEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @ManyToMany(() => CategoryEntity, category => category.publishers)
  @JoinTable(
    {
      name: process.env.DB_TABLE_PUBLISHER,
      joinColumn: {
        name: 'publisherId',
        referencedColumnName: 'id'
      },
      inverseJoinColumn: {
        name: 'categoryId',
        referencedColumnName: 'id'
      }
    }
  )
  categories!: CategoryEntity[]
}
