import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CategoryCreateInput {
  @Field()
  @IsString()
  name!: string;
}

@InputType()
export class CategoryUpdateInput {
  @Field()
  @IsOptional()
  name?: string;
}