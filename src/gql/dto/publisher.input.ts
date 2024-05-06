import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PublisherCreateInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  username!: string;

  @Field()
  @IsString()
  password!: string;
}

@InputType()
export class PublisherUpdateInput {
  @Field()
  @IsOptional()
  name?: string;

  @Field()
  @IsOptional()
  username?: string;

  @Field()
  @IsOptional()
  password?: string;
}