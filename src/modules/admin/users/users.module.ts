import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { AdminUsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [AdminUsersService],
})
export class UsersModule {}
