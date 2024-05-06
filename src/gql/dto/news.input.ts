import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class NewsCreateInput {
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

	@IsOptional()
	@IsString()
	@Field()
	publisherId?: string;
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