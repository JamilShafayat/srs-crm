import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { TeamEntity } from 'src/common/entities/team.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateTeamDto } from '../dto/create-team.dto';
import { StatusChangeTeamDto } from '../dto/status-change-team.dto';
import { TeamListDto } from '../dto/team-list.dto';
import { UpdateTeamDto } from '../dto/update-team-dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: TeamListDto,
    pagination: PaginationDto,
  ): Promise<[TeamEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //find teams
      const teams = await this.teamRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
      });

      //count total teams
      const total = await this.teamRepository.count({
        where: { ...whereCondition },
      });

      // return fetched data
      return [teams, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createTeamDto: CreateTeamDto, user: AdminUserDto) {
    try {
      const { name } = createTeamDto;

      //find existing team
      const findExisting = await this.teamRepository.findOne({ name });

      // if found team
      if (findExisting) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'name',
            message: 'This Team Name Already Exists.',
          },
        ]);
      }

      const data = {
        name,
        created_by: user.id,
      };

      // team store
      const addedTeamData = await this.teamRepository.save(data);

      // created data return
      return addedTeamData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // all active data fetch
      const expectedData = await this.teamRepository.findAndCount({
        status: 1,
      });

      // return fetched data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<TeamEntity> {
    try {
      // Single team fetch
      const expectedData = await this.teamRepository.findOne({
        where: { id },
      });

      // Team not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, user: AdminUserDto) {
    try {
      //update data
      await this.teamRepository.update(
        {
          id: id,
        },
        {
          name: updateTeamDto.name,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const TeamData = await this.teamRepository.findOne(id);

      //return updated row
      return TeamData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeTeamDto: StatusChangeTeamDto,
    user: AdminUserDto,
  ) {
    try {
      // find data
      const expectedData = await this.teamRepository.findOne(id);

      // data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //update data status
      await this.teamRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeTeamDto.status,
          updated_by: user.id,
        },
      );

      const team = await this.teamRepository.findOne(id);

      return team;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find Team
      const expectedData = await this.teamRepository.findOne({ id: id });

      // Team not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Team Found!');
      }

      await this.connection.transaction(async (manager) => {
        //update deleted by
        await manager.getRepository<TeamEntity>('teams').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //soft delete team
        await manager.getRepository<TeamEntity>('teams').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // find team id
      const expectedData = await this.teamRepository.find({
        where: { id },
        withDeleted: true,
      });

      // team id not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Team Found!');
      }

      //delete team
      await this.teamRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
