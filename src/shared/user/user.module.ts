import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherEntity } from '#entity/publisher';

@Module({
  imports: [TypeOrmModule.forFeature([PublisherEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
