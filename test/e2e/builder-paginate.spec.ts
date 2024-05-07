// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Operator, OperatorWhere, OrderingMode } from "src/gql/common/dto/find-all.args";
// import { PaginateBuilder } from "src/gql/common/providers/builder-paginate.service";
// import { SelectQueryBuilder } from "typeorm";

// describe('PaginateBuilder', () => {
//   let paginateBuilder: PaginateBuilder;
//   let queryBuilderMock: SelectQueryBuilder<any>;

//   beforeEach(() => {
//     paginateBuilder = new PaginateBuilder();
//     queryBuilderMock = {
//       andWhere: jest.fn(),
//       orWhere: jest.fn(),
//       addOrderBy: jest.fn(),
//       offset: jest.fn(),
//       limit: jest.fn(),
//     } as any;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should apply where operator correctly', () => {
//     const key = 'columnName';
//     const values = ['value1', 'value2'];
//     const operatorWhere = OperatorWhere.andWhere;
//     const operator = Operator.eq;
//     const expectedCondition = "columnName = 'value1' AND columnName = 'value2'";
    
//     paginateBuilder.applyWhereOperator(key, values, operatorWhere, operator);

//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedCondition);
//   });

//   it('should apply single filter correctly', () => {
//     const filter = {
//       key: 'columnName',
//       values: ['value1', 'value2'],
//       operator: Operator.eq,
//     };
    
//     paginateBuilder.applySingleFilter(queryBuilderMock, filter);

//     const expectedCondition = "columnName = 'value1' OR columnName = 'value2'";
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedCondition);
//   });

//   it('should apply filters correctly', () => {
//     const filters = [
//       {
//         key: 'columnName1',
//         values: ['value1', 'value2'],
//         operator: Operator.eq,
//       },
//       {
//         key: 'columnName2',
//         values: ['value3'],
//         operator: Operator.gt,
//       }
//     ];
    
//     paginateBuilder.applyFilters(queryBuilderMock, filters);

//     const expectedCondition1 = "columnName1 = 'value1' OR columnName1 = 'value2'";
//     const expectedCondition2 = "columnName2 > 'value3'";
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedCondition1);
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedCondition2);
//   });

//   it('should apply searches correctly', () => {
//     const searches = [
//       { key: 'columnName1', value: 'searchValue1' },
//       { key: 'columnName2', value: 'searchValue2' }
//     ];
    
//     paginateBuilder.applySearches(queryBuilderMock, searches);

//     const expectedCondition1 = "columnName1 LIKE :value";
//     const expectedCondition2 = "columnName2 LIKE :value";
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedCondition1, { value: '%searchValue1%' });
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedCondition2, { value: '%searchValue2%' });
//   });

//   it('should apply orders correctly', () => {
//     const orders = [
//       { key: 'columnName1', value: 'ASC' },
//       { key: 'columnName2', value: 'DESC' }
//     ];
    
//     paginateBuilder.applyOrders(queryBuilderMock, orders);

//     expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('columnName1', 'ASC');
//     expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('columnName2', 'DESC');
//   });

//   it('should apply find all args correctly', () => {
//     const args = {
//       filters: [
//         {
//           key: 'columnName1',
//           values: ['value1', 'value2'],
//           operator: Operator.eq,
//         },
//         {
//           key: 'columnName2',
//           values: ['value3'],
//           operator: Operator.gt,
//         }
//       ],
//       searches: [
//         { key: 'columnName1', value: 'searchValue1' },
//         { key: 'columnName2', value: 'searchValue2' }
//       ],
//       orders: [
//         { key: 'columnName1', value: OrderingMode.ASC },
//         { key: 'columnName2', value: OrderingMode.DESC }
//       ],
//       offset: 0,
//       limit: 10,
//     };
    
//     paginateBuilder.applyFindAllArgs(queryBuilderMock, args);

//     const expectedFilterCondition1 = "columnName1 = 'value1' OR columnName1 = 'value2'";
//     const expectedFilterCondition2 = "columnName2 > 'value3'";
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedFilterCondition1);
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedFilterCondition2);

//     const expectedSearchCondition1 = "columnName1 LIKE :value";
//     const expectedSearchCondition2 = "columnName2 LIKE :value";
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedSearchCondition1, { value: '%searchValue1%' });
//     expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(expectedSearchCondition2, { value: '%searchValue2%' });

//     expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('columnName1', 'ASC');
//     expect(queryBuilderMock.addOrderBy).toHaveBeenCalledWith('columnName2', 'DESC');

//     expect(queryBuilderMock.offset).toHaveBeenCalledWith(0);
//     expect(queryBuilderMock.limit).toHaveBeenCalledWith(10);
//   });
// });
