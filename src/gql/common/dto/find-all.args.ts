import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsInt, IsString } from 'class-validator';

export enum Operator {
  eq = 'eq',
  ne = 'ne',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  in = 'in',
}

export enum OrderingMode {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Operator, {
  name: 'Operator',
});

registerEnumType(OrderingMode, {
  name: 'OrderingMode',
});

@InputType()
export class Filtering {
  @Field()
  @IsString()
  key!: string;

  @Field(() => Operator, { defaultValue: Operator.eq })
  @IsEnum(Operator)
  operator?: Operator;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  values!: string[];
}

@InputType()
export class Searching {
  @Field()
  @IsString()
  key!: string;

  @Field()
  @IsString()
  value!: string;
}

@InputType()
export class Order {
  @Field()
  @IsString()
  key!: string;

  @Field(() => OrderingMode, { defaultValue: OrderingMode.ASC })
  @IsEnum(OrderingMode)
  value!: OrderingMode;
}

@InputType()
export class FindAllArgs {
  @Field(() => [Filtering], { nullable: true, defaultValue: [] })
  @IsArray()
  filters?: Filtering[];

  @Field(() => [Searching], { nullable: true, defaultValue: [] })
  @IsArray()
  searches?: Searching[];

  @Field(() => [Order], { nullable: true, defaultValue: [] })
  @IsArray()
  orders?: Order[];

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  offset?: number;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  limit?: number;

  @Field(() => [FindAllArgs], { nullable: true, defaultValue: [] })
  @IsArray()
  and?: FindAllArgs[];

  @Field(() => [FindAllArgs], { nullable: true, defaultValue: [] })
  @IsArray()
  or?: FindAllArgs[];
}
