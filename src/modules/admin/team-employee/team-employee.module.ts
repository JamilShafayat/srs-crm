import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEmployeeEntity } from 'src/common/entities/team_employee.entity';
import { TeamEmployeeController } from './controllers/team-employee.controllers';
import { TeamEmployeeService } from './services/team-employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEmployeeEntity])],
  controllers: [TeamEmployeeController],
  providers: [TeamEmployeeService],
})
export class TeamEmployeeModule {}
