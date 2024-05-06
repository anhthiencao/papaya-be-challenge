import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  public access_token!: string;

  @Field()
  public refresh_token!: string;
}
