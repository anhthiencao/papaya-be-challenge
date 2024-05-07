import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Filtering, FindAllArgs, Operator, OperatorWhere } from '../dto';

@Injectable()
export class PaginateBuilder {
  private readonly mappingOperator = {
    [Operator.eq]: '=',
    [Operator.ne]: '!=',
    [Operator.gt]: '>',
    [Operator.gte]: '>=',
    [Operator.lt]: '<',
    [Operator.lte]: '<=',
    [Operator.in]: 'IN',
    [Operator.nin]: 'NOT IN',
  };

  applyWhereOperator(key: string, values: string[], operatorWhere: OperatorWhere, operator: Operator) {
    if (operator === Operator.in || operator === Operator.nin) {
      return `${key} ${this.mappingOperator[operator]} (${values.map((value) => `'${value}'`).join(', ')})`;
    }

    return operatorWhere === OperatorWhere.andWhere
      ? values.map((value) => `${key} ${this.mappingOperator[operator]} '${value}'`).join(' AND ')
      : values.map((value) => `${key} ${this.mappingOperator[operator]} '${value}'`).join(' OR ');
  }
  applySingleFilter(queryBuilder: SelectQueryBuilder<any>, filter: Filtering, operatorWhere: OperatorWhere = OperatorWhere.andWhere) {
    const { key, values, operator = Operator.eq } = filter;

    if (!key || !values || values.length === 0) {
      return;
    }

    queryBuilder[operatorWhere](this.applyWhereOperator(key, values, operatorWhere, operator));

    return queryBuilder;
  }
  applyFilters(queryBuilder: SelectQueryBuilder<any>, filters: Filtering[], operatorWhere: OperatorWhere = OperatorWhere.andWhere) {
    filters.forEach((filter) => {
      this.applySingleFilter(queryBuilder, filter, operatorWhere);
      const { and, or } = filter;

      if (and && and.length > 0) {
        this.applyFilters(queryBuilder, and, OperatorWhere.andWhere);
      }

      if (or && or.length > 0) {
        this.applyFilters(queryBuilder, or, OperatorWhere.orWhere);
      }
    });
  }

  applySearches(queryBuilder: SelectQueryBuilder<any>, searches: any[]) {
    searches.forEach((search) => {
      const { key, value } = search;
      queryBuilder.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
    });
  }

  applyOrders(queryBuilder: SelectQueryBuilder<any>, orders: any[]) {
    orders.forEach((order) => {
      const { key, value } = order;
      queryBuilder.addOrderBy(key, value);
    });
  }

  applyFindAllArgs(queryBuilder: SelectQueryBuilder<any>, args: FindAllArgs): SelectQueryBuilder<any> {
    const { filters, searches, orders, offset, limit } = args;

    if (filters && filters.length > 0) {
      this.applyFilters(queryBuilder, filters);
    }

    if (searches && searches.length > 0) {
      this.applySearches(queryBuilder, searches);
    }

    if (orders && orders.length > 0) {
      this.applyOrders(queryBuilder, orders);
    }

    queryBuilder.offset(offset).limit(limit);

    return queryBuilder;
  }
}
