import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class News {
  @Field(() => ID)
  id!: string;

  title?: string;

  @Field({defaultValue: ''})
  content?: string;

  @Field(() => ID)
  categoryId?: string;

  @Field({defaultValue: '1'})
  publisherId?: string;

  @Field()
  createdAt?: Date;
}

