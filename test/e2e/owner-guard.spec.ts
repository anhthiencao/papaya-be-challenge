// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { ExecutionContext } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { OwnerNewsGuard } from 'src/auth/guards/owner-auth.guard';
// import { NewsService } from 'src/gql/providers/news.service';

// describe('OwnerNewsGuard', () => {
//   let guard: OwnerNewsGuard;
//   let newsService: NewsService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         OwnerNewsGuard,
//         {
//           provide: NewsService,
//           useValue: {
//             findById: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     guard = moduleRef.get<OwnerNewsGuard>(OwnerNewsGuard);
//     newsService = moduleRef.get<NewsService>(NewsService);
//   });

//   describe('canActivate', () => {
//     it('should return true if the user is the publisher of the news item', async () => {
//       const context = {
//         switchToHttp: jest.fn().mockReturnValue({
//           getRequest: jest.fn().mockReturnValue({ user: { userId: 'user123' } }),
//         }),
//         getArgs: jest.fn().mockReturnValue([{ params: { id: 'news123' } }]),
//       } as unknown as ExecutionContext;

//       jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(context as any);
//       jest.spyOn(guard, 'canActivate').mockResolvedValue(true);

//       const result = await guard.canActivate(context);

//       expect(result).toBe(true);
//       expect(newsService.findById).toHaveBeenCalledWith('news123');
//       expect(guard.isUserNewsPublisher).toHaveBeenCalledWith('news123', 'user123');
//     });

//     it('should return false if the user is not the publisher of the news item', async () => {
//       const context = {
//         switchToHttp: jest.fn().mockReturnValue({
//           getRequest: jest.fn().mockReturnValue({ user: { userId: 'user123' } }),
//         }),
//         getArgs: jest.fn().mockReturnValue([{ params: { id: 'news123' } }]),
//       } as unknown as ExecutionContext;

//       jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(context as any);
//       jest.spyOn(guard, 'isUserNewsPublisher').mockResolvedValue(false);

//       const result = await guard.canActivate(context);

//       expect(result).toBe(false);
//       expect(newsService.findById).toHaveBeenCalledWith('news123');
//       expect(guard.isUserNewsPublisher).toHaveBeenCalledWith('news123', 'user123');
//     });
//   });
// });