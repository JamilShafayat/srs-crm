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

      const total = await this.teamRepository.count({
        where: { ...whereCondition },
      });

      return [teams, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createTeamDto: CreateTeamDto, user: AdminUserDto) {
    try {
      const { name } = createTeamDto;

      //find existing team
      const findTeam = await this.teamRepository.findOne({ name });

      if (findTeam) {
        throw new ValidationException([
          {
            field: 'name',
            message: 'This team name already exists in the system.',
          },
        ]);
      }

      const createTeam = {
        name,
        created_by: user.id,
      };

      const team = await this.teamRepository.save(createTeam);

      return team;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // find all active teams
      const teams = await this.teamRepository.findAndCount({
        status: 1,
      });

      return teams;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<TeamEntity> {
    try {
      // find single team
      const team = await this.teamRepository.findOne({
        where: { id },
      });

      if (!team) {
        throw new NotFoundException('No team found on this id!');
      }
      return team;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto, user: AdminUserDto) {
    try {
      // find team
      const findTeam = await this.teamRepository.findOne(id);

      if (!findTeam) {
        throw new NotFoundException('No team found on this id!');
      }

      // update single team
      await this.teamRepository.update(
        {
          id: id,
        },
        {
          name: updateTeamDto.name,
          updated_by: user.id,
        },
      );

      const team = await this.teamRepository.findOne(id);

      return team;
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
      // find team
      const findTeam = await this.teamRepository.findOne(id);

      if (!findTeam) {
        throw new NotFoundException('No team found on this id!');
      }

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
      // find team
      const team = await this.teamRepository.findOne({ id: id });

      if (!team) {
        throw new NotFoundException('No Team Found on this id!');
      }

      await this.connection.transaction(async (manager) => {
        await manager.getRepository<TeamEntity>('teams').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        await manager.getRepository<TeamEntity>('teams').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // find team
      const team = await this.teamRepository.find({
        where: { id },
        withDeleted: true,
      });

      if (!team) {
        throw new NotFoundException('No team found on this id!');
      }

      await this.teamRepository.delete(id);

      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
