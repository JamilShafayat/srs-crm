import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from 'src/common/entities/team.entity';
import { TeamController } from './controllers/team.controllers';
import { TeamService } from './services/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
