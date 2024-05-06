import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class NewsCreateInput {
  @IsString()
  @Field(() => ID)
  id!: string;

  @IsString()
  @Field()
  title!: string;

  @IsOptional()
  @IsString()
  @Field({ defaultValue: '' })
  content?: string;

  @IsOptional()
  @IsString()
  @Field()
  categoryId?: string;
}

@InputType()
export class NewsUpdateInput {
	@IsString()
	@IsOptional()
  @Field()
  title?: string;

  @IsOptional()
  @IsString()
  @Field({ defaultValue: '' })
  content?: string;

  @IsOptional()
  @IsString()
  @Field()
	categoryId?: string;
}