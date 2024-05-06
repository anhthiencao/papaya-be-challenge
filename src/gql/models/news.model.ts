import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class News {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({defaultValue: ''})
  content?: string;

  @Field(() => ID)
  categoryId!: string;

  @Field(() => ID)
  publisherId!: string;

  @Field()
  createdAt!: Date;
}

