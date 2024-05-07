import { CategoryEntity } from '#entity/category';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
@Entity(process.env.DB_TABLE_PUBLISHER)
@Unique(['username'])
export class PublisherEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false, length: 255, name: 'name' })
  name!: string;

  @Column('varchar', { nullable: false, length: 255, name: 'username' })
  username!: string;

  @Column('varchar', { nullable: false, length: 255, name: 'password' })
  password!: string;

  @ManyToMany(() => CategoryEntity, (category: CategoryEntity) => category.publishers)
  @JoinTable(
    {
      name: process.env.DB_TABLE_NEWS,
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
