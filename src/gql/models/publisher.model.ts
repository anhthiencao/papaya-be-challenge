import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';

@ObjectType()
export class Publisher {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @HideField()
  username?: string;

  @HideField()
  password?: string;
}

