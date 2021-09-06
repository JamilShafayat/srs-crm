import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
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

      //state filter
      // if (filter.phone) {
      //   whereCondition['phone'] = Equal(filter.phone);
      // }

      //find users
      const employees = await this.employeeRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['user_info', 'designation_info'],
      });

      //count total employee
      const total = await this.employeeRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [employees, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto, user: AdminUserDto) {
    try {
      const { full_name, expertise, user_id, designation_id } =
        createEmployeeDto;

      //find Existing Entry
      const findExisting = await this.employeeRepository.findOne({ user_id });

      // Entry if found
      if (findExisting) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'user_id',
            message: 'User Already Exists.',
          },
        ]);
      }

      //Data store
      const data = {
        full_name,
        expertise,
        user_id,
        designation_id,
        created_by: user.id,
      };

      const addedEmployeeData = await this.employeeRepository.save(data);

      // Created Data Return
      return addedEmployeeData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.employeeRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<EmployeeEntity> {
    try {
      // Single employee fetch
      const expectedData = await this.employeeRepository.findOne({
        where: { id },
        relations: ['user_info', 'designation_info'],
      });

      // employee not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Employee Found!');
      }
      return expectedData;
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
      //update data
      await this.employeeRepository.update(
        {
          id: id,
        },
        {
          full_name: updateEmployeeDto.full_name,
          expertise: updateEmployeeDto.expertise,
          user_id: updateEmployeeDto.user_id,
          designation_id: updateEmployeeDto.designation_id,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const employee = await this.employeeRepository.findOne({
        where: { id },
        relations: ['user_info', 'designation_info'],
      });

      //return updated row
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
      // Find employee
      const expectedData = await this.employeeRepository.findOne(id);

      // employee not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Employee Found!');
      }

      //update employee status
      await this.employeeRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeEmployeeDto.status,
          updated_by: user.id,
        },
      );

      // Updated employee fetch
      const employee = await this.employeeRepository.findOne(id);

      //return updated employee
      return employee;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find employee
      const expectedData = await this.employeeRepository.findOne({ id: id });

      // employee not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Employee Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<EmployeeEntity>('employees').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //Soft delete employee
        await manager.getRepository<EmployeeEntity>('employees').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find employee
      const expectedData = await this.employeeRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Employee Found!');
      }

      //Delete data
      await this.employeeRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
