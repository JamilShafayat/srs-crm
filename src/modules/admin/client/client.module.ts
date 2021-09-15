import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/common/entities/client.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ClientEntity])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
