import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ClientEntity } from 'src/common/entities/client.entity';
import { ProjectEntity } from 'src/common/entities/project.entity';
import { TeamEntity } from 'src/common/entities/team.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectFilterListDto } from '../dto/project-filter-list.dto';
import { StatusChangeProjectDto } from '../dto/status-change-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(ClientEntity)
		private readonly clientRepository: Repository<ClientEntity>,
		@InjectRepository(TeamEntity)
		private readonly teamRepository: Repository<TeamEntity>,
		@InjectRepository(ProjectEntity)
		private readonly projectRepository: Repository<ProjectEntity>,
		private connection: Connection,
	) { }

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

			const total = await this.projectRepository.count({
				where: { ...whereCondition },
			});

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

			// find team
			const findTeam = await this.teamRepository.findOne({
				where: { id: team_id },
			});

			if (!findTeam) {
				throw new NotFoundException('No team found on this id!');
			}

			// find client
			const findClient = await this.clientRepository.findOne({
				where: { id: client_id },
			});

			if (!findClient) {
				throw new NotFoundException('No client found on this id!');
			}

			const newProject = {
				name,
				feature,
				initiate_date,
				completion_date,
				team_id,
				client_id,
				created_by: user.id,
			};

			const createProject = await this.projectRepository.save(newProject);

			const project = await this.projectRepository.findOne({
				where: { id: createProject.id },
				relations: ['team_info', 'client_info'],
			});

			return project;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findAllList() {
		try {
			// find all active projects
			const projects = await this.projectRepository.findAndCount({
				status: 1,
			});

			return projects;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findOne(id: string): Promise<ProjectEntity> {
		try {
			// find single project
			const project = await this.projectRepository.findOne({
				where: { id },
				relations: ['team_info', 'client_info'],
			});

			if (!project) {
				throw new NotFoundException('No Project Found!');
			}
			return project;
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
			// find project
			const findProject = await this.projectRepository.findOne(id);

			if (!findProject) {
				throw new NotFoundException('No project found on this id!');
			}

			//update single project
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

			const project = await this.projectRepository.findOne({
				where: { id },
				relations: ['team_info', 'client_info'],
			});

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
			// find project
			const findProject = await this.projectRepository.findOne(id);

			if (!findProject) {
				throw new NotFoundException('No project found on this id!');
			}

			await this.projectRepository.update(
				{
					id: id,
				},
				{
					status: statusChangeProjectDto.status,
					updated_by: user.id,
				},
			);

			const project = await this.projectRepository.findOne(id);

			return project;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async remove(id: string, user: AdminUserDto) {
		try {
			// find project
			const project = await this.projectRepository.findOne({ id: id });

			if (!project) {
				throw new NotFoundException('No project found on this id!');
			}

			await this.connection.transaction(async (manager) => {
				await manager.getRepository<ProjectEntity>('projects').update(
					{
						id: id,
					},
					{
						deleted_by: user.id,
					},
				);

				await manager.getRepository<ProjectEntity>('projects').softDelete(id);
				return true;
			});
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async finalDelete(id: string) {
		try {
			// find project
			const project = await this.projectRepository.find({
				where: { id },
				withDeleted: true,
			});

			if (!project) {
				throw new NotFoundException('No project found on this id!');
			}

			await this.projectRepository.delete(id);

			return true;
		} catch (error) {
			throw new CustomException(error);
		}
	}
}
