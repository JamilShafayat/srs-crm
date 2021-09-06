import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeService } from './services/employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
