import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeFilterListDto } from '../dto/employee-filter-list.dto';
import { StatusChangeEmployeeDto } from '../dto/status-change-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: EmployeeFilterListDto,
    pagination: PaginationDto,
  ): Promise<[EmployeeEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //find employees
      const employees = await this.employeeRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['user_info', 'designation_info'],
      });

      const total = await this.employeeRepository.count({
        where: { ...whereCondition },
      });

      return [employees, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto, user: AdminUserDto) {
    try {
      const {
        name,
        phone,
        email,
        password,
        user_type,
        full_name,
        expertise,
        designation_id,
      } = createEmployeeDto;

      const checkUserName = await this.userRepository.findOne({ name });
      const checkUserPhoneNumber = await this.userRepository.findOne({ phone });
      const checkEmployeeFullName = await this.employeeRepository.findOne({
        full_name,
      });

      //find existing user
      if (checkUserName || checkUserPhoneNumber) {
        throw new ValidationException([
          {
            field: checkUserName ? 'name' : 'phone',
            message:
              'This user name or phone number is already exists in the system.',
          },
        ]);
      }

      //find existing employee
      if (checkEmployeeFullName) {
        throw new ValidationException([
          {
            field: 'full_name',
            message: 'This employee full name is already exists in the system.',
          },
        ]);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        name,
        phone,
        email,
        user_type,
        password: hashedPassword,
        created_by: user.id,
      };

      const createUser = await this.userRepository.save(newUser);

      const newEmployee = {
        full_name,
        expertise,
        user_id: createUser.id,
        designation_id,
        created_by: user.id,
      };

      const createEmployee = await this.employeeRepository.save(newEmployee);

      const employee = await this.employeeRepository.findOne({
        where: { id: createEmployee.id },
        relations: ['user_info', 'designation_info'],
      });

      return employee;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // find all active employees
      const employees = await this.employeeRepository.findAndCount({
        status: 1,
      });

      return employees;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<EmployeeEntity> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id },
        relations: ['user_info', 'designation_info'],
      });

      if (!employee) {
        throw new NotFoundException('No employee found on this id!');
      }
      return employee;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    user: AdminUserDto,
  ) {
    try {
      await this.employeeRepository.update(
        {
          id: id,
        },
        {
          full_name: updateEmployeeDto.full_name,
          expertise: updateEmployeeDto.expertise,
          designation_id: updateEmployeeDto.designation_id,
          updated_by: user.id,
        },
      );

      const employee = await this.employeeRepository.findOne({
        where: { id },
        relations: ['user_info', 'designation_info'],
      });

      return employee;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeEmployeeDto: StatusChangeEmployeeDto,
    user: AdminUserDto,
  ) {
    try {
      // find employee
      const findEmployee = await this.employeeRepository.findOne(id);

      if (!findEmployee) {
        throw new NotFoundException('No employee found on this id!');
      }

      await this.employeeRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeEmployeeDto.status,
          updated_by: user.id,
        },
      );

      const employee = await this.employeeRepository.findOne(id);

      return employee;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // find employee
      const employee = await this.employeeRepository.findOne({ id: id });

      if (!employee) {
        throw new NotFoundException('No employee found on this id!');
      }

      await this.connection.transaction(async (manager) => {
        await manager.getRepository<EmployeeEntity>('employees').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        await manager.getRepository<EmployeeEntity>('employees').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // find employee
      const employee = await this.employeeRepository.find({
        where: { id },
        withDeleted: true,
      });

      if (!employee) {
        throw new NotFoundException('No employee found on this id!');
      }

      await this.employeeRepository.delete(id);

      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
