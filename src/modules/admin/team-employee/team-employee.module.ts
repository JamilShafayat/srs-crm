import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { TeamEntity } from 'src/common/entities/team.entity';
import { TeamEmployeeEntity } from 'src/common/entities/team_employee.entity';
import { TeamEmployeeController } from './controllers/team-employee.controllers';
import { TeamEmployeeService } from './services/team-employee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity, TeamEntity, TeamEmployeeEntity]),
  ],
  controllers: [TeamEmployeeController],
  providers: [TeamEmployeeService],
})
export class TeamEmployeeModule {}
