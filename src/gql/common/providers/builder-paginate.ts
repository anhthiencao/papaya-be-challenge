import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Filtering, FindAllArgs } from '../dto';

@Injectable()
export class PaginateBuilder {
  applyFilters(queryBuilder: SelectQueryBuilder<any>, filters: Filtering[]) {
    filters.forEach(filter => {
      const { key, operator, values } = filter;
      switch (operator) {
        case 'eq':
          queryBuilder.orWhere(`${key} = :value`, { value: values[0] });
          break;
        case 'ne':
          queryBuilder.orWhere(`${key} != :value`, { value: values[0] });
          break;
        case 'gt':
          queryBuilder.orWhere(`${key} > :value`, { value: values[0] });
          break;
        case 'gte':
          queryBuilder.orWhere(`${key} >= :value`, { value: values[0] });
          break;
        case 'lt':
          queryBuilder.orWhere(`${key} < :value`, { value: values[0] });
          break;
        case 'lte':
          queryBuilder.orWhere(`${key} <= :value`, { value: values[0] });
          break;
        case 'in':
          queryBuilder.orWhere(`${key} IN (:...value)`, { value: values });
          break;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    });
  }

  applySearches(queryBuilder: SelectQueryBuilder<any>, searches: any[]) {
    searches.forEach(search => {
      const { key, value } = search;
      queryBuilder.andWhere(`${key} LIKE :value`, { value: `%${value}%` });
    });
  }

  applyOrders(queryBuilder: SelectQueryBuilder<any>, orders: any[]) {
    orders.forEach(order => {
      const { key, value } = order;
      queryBuilder.addOrderBy(key, value);
    });
  }

  applyFindAllArgs(queryBuilder: SelectQueryBuilder<any>, args: FindAllArgs): SelectQueryBuilder<any> {
    const { filters, searches, orders, offset, limit, and, or } = args;

    if (filters && filters.length > 0) {
      this.applyFilters(queryBuilder, filters);
    }

    if (searches && searches.length > 0) {
      this.applySearches(queryBuilder, searches);
    }

    if (orders && orders.length > 0) {
      this.applyOrders(queryBuilder, orders);
    }

    if (and && and.length > 0) {
      queryBuilder.andWhere(subQuery => {
        and.forEach(subArgs => {
          this.applyFindAllArgs(subQuery, subArgs);
        });
      });
    }

    if (or && or.length > 0) {
      queryBuilder.orWhere(subQuery => {
        or.forEach(subArgs => {
          this.applyFindAllArgs(subQuery, subArgs);
        });
      });
    }

    queryBuilder.offset(offset).limit(limit);

    return queryBuilder;
  }
}
