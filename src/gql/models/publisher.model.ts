// publisher.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Publisher {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}
