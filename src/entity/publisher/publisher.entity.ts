import { CategoryEntity } from '#entity/category';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';

@Entity('publisher')
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
      name: 'news',
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
