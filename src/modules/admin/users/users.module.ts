import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserEntity } from 'src/common/entities/admin/users/user.entity';
import { UsersController } from './controllers/users.controller';
import { AdminUsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  controllers: [UsersController],
  providers: [AdminUsersService],
})
export class UsersModule {}
