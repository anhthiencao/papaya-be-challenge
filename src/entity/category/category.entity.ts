import { PublisherEntity } from '#entity/publisher';
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from 'typeorm';

@Entity('category')
@Unique(['name'])
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToMany(() => PublisherEntity, (publisher) => publisher.categories)
  @JoinTable(
    {
      name: 'news',
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
