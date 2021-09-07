import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { TeamEmployeeEntity } from 'src/common/entities/team_employee.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateTeamEmployeeDto } from '../dto/create-team-employee.dto';
import { StatusChangeTeamEmployeeDto } from '../dto/status-change-team-employee.dto';
import { TeamEmployeeListDto } from '../dto/team-employee-list.dto';
import { UpdateTeamEmployeeDto } from '../dto/update-team-employee.dto';

@Injectable()
export class TeamEmployeeService {
  constructor(
    @InjectRepository(TeamEmployeeEntity)
    private readonly teamEmployeeRepository: Repository<TeamEmployeeEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: TeamEmployeeListDto,
    pagination: PaginationDto,
  ): Promise<[TeamEmployeeEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //find team-employees
      const teamEmployees = await this.teamEmployeeRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['employee_info', 'team_info'],
      });

      //count total team-employees
      const total = await this.teamEmployeeRepository.count({
        where: { ...whereCondition },
      });

      // return fetched data
      return [teamEmployees, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(
    createTeamEmployeeDto: CreateTeamEmployeeDto,
    user: AdminUserDto,
  ) {
    try {
      const { employee_id, team_id } = createTeamEmployeeDto;

      const data = {
        employee_id,
        team_id,
        created_by: user.id,
      };

      // team-employees store
      const addedTeamEmployeeData = await this.teamEmployeeRepository.save(
        data,
      );

      // created data return
      return addedTeamEmployeeData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // all active data fetch
      const expectedData = await this.teamEmployeeRepository.findAndCount({
        status: 1,
      });

      // return fetched data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<TeamEmployeeEntity> {
    try {
      // Single team-employee fetch
      const expectedData = await this.teamEmployeeRepository.findOne({
        where: { id },
        relations: ['employee_info', 'team_info'],
      });

      // Team-employee not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(
    id: string,
    updateTeamEmployeeDto: UpdateTeamEmployeeDto,
    user: AdminUserDto,
  ) {
    try {
      //update data
      await this.teamEmployeeRepository.update(
        {
          id: id,
        },
        {
          employee_id: updateTeamEmployeeDto.employee_id,
          team_id: updateTeamEmployeeDto.team_id,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const TeamEmployeeData = await this.teamEmployeeRepository.findOne({
        where: { id },
        relations: ['employee_info', 'team_info'],
      });

      //return updated row
      return TeamEmployeeData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeTeamEmployeeDto: StatusChangeTeamEmployeeDto,
    user: AdminUserDto,
  ) {
    try {
      // find data
      const expectedData = await this.teamEmployeeRepository.findOne(id);

      // data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //update data status
      await this.teamEmployeeRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeTeamEmployeeDto.status,
          updated_by: user.id,
        },
      );

      const teamEmployee = await this.teamEmployeeRepository.findOne(id);

      return teamEmployee;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find Team-employee
      const expectedData = await this.teamEmployeeRepository.findOne({
        id: id,
      });

      // Team-employee not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Team Found!');
      }

      await this.connection.transaction(async (manager) => {
        //update deleted by
        await manager
          .getRepository<TeamEmployeeEntity>('team_employees')
          .update(
            {
              id: id,
            },
            {
              deleted_by: user.id,
            },
          );

        //soft delete team
        await manager
          .getRepository<TeamEmployeeEntity>('team_employees')
          .softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // find team-employee id
      const expectedData = await this.teamEmployeeRepository.find({
        where: { id },
        withDeleted: true,
      });

      // team-employee id not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Team-employee Found!');
      }

      //delete team-employee
      await this.teamEmployeeRepository.delete(id);

      //return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
