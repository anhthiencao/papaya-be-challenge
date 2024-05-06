import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('publisher')
export class PublisherEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;
}
