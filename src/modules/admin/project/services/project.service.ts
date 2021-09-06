import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ProjectEntity } from 'src/common/entities/project.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectFilterListDto } from '../dto/project-filter-list.dto';
import { StatusChangeProjectDto } from '../dto/status-change-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: ProjectFilterListDto,
    pagination: PaginationDto,
  ): Promise<[ProjectEntity[], number]> {
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

      //find projects
      const projects = await this.projectRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['team_info', 'client_info'],
      });

      //count total projects
      const total = await this.projectRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [projects, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createProjectDto: CreateProjectDto, user: AdminUserDto) {
    try {
      const {
        name,
        feature,
        initiate_date,
        completion_date,
        team_id,
        client_id,
      } = createProjectDto;

      //data store
      const data = {
        name,
        feature,
        initiate_date,
        completion_date,
        team_id,
        client_id,
        created_by: user.id,
      };

      const addedEmployeeData = await this.projectRepository.save(data);

      // Created data return
      return addedEmployeeData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.projectRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<ProjectEntity> {
    try {
      // single project fetch
      const expectedData = await this.projectRepository.findOne({
        where: { id },
        relations: ['team_info', 'client_info'],
      });

      // project not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Project Found!');
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: AdminUserDto,
  ) {
    try {
      //update data
      await this.projectRepository.update(
        {
          id: id,
        },
        {
          name: updateProjectDto.name,
          feature: updateProjectDto.feature,
          initiate_date: updateProjectDto.initiate_date,
          completion_date: updateProjectDto.completion_date,
          team_id: updateProjectDto.team_id,
          client_id: updateProjectDto.client_id,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['team_info', 'client_info'],
      });

      //return updated row
      return project;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeProjectDto: StatusChangeProjectDto,
    user: AdminUserDto,
  ) {
    try {
      // Find project
      const expectedData = await this.projectRepository.findOne(id);

      // project not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Project Found!');
      }

      //update project status
      await this.projectRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeProjectDto.status,
          updated_by: user.id,
        },
      );

      // Updated project fetch
      const project = await this.projectRepository.findOne(id);

      //return updated project
      return project;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find project
      const expectedData = await this.projectRepository.findOne({ id: id });

      // project not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Project Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<ProjectEntity>('projects').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //Soft delete project
        await manager.getRepository<ProjectEntity>('projects').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find project
      const expectedData = await this.projectRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Project Found!');
      }

      //Delete data
      await this.projectRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
