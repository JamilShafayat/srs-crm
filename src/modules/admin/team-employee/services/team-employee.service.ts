import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { EmployeeEntity } from 'src/common/entities/employee.entity';
import { TeamEntity } from 'src/common/entities/team.entity';
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
		@InjectRepository(EmployeeEntity)
		private readonly employeeRepository: Repository<EmployeeEntity>,
		@InjectRepository(TeamEntity)
		private readonly teamRepository: Repository<TeamEntity>,
		@InjectRepository(TeamEmployeeEntity)
		private readonly teamEmployeeRepository: Repository<TeamEmployeeEntity>,
		private connection: Connection,
	) { }

	async findAll(
		filter: TeamEmployeeListDto,
		pagination: PaginationDto,
	): Promise<[TeamEmployeeEntity[], number]> {
		try {
			const whereCondition = {};

			// status filter
			if (filter.status) {
				whereCondition['status'] = Equal(filter.status);
			}

			// find team-employees
			const teamEmployees = await this.teamEmployeeRepository.find({
				where: {
					...whereCondition,
				},
				order: { created_by: 'DESC' },
				skip: pagination.skip,
				take: pagination.limit,
				relations: ['employee_info', 'team_info'],
			});

			const total = await this.teamEmployeeRepository.count({
				where: { ...whereCondition },
			});

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

			// find employee
			const findEmployee = await this.employeeRepository.findOne({
				where: { id: employee_id },
			});

			if (!findEmployee) {
				throw new NotFoundException('No employee found on this id!');
			}

			// find team
			const findTeam = await this.teamRepository.findOne({
				where: { id: team_id },
			});

			if (!findTeam) {
				throw new NotFoundException('No team found on this id!');
			}

			const newTeamEmployee = {
				employee_id,
				team_id,
				created_by: user.id,
			};

			const createTeamEmployee = await this.teamEmployeeRepository.save(
				newTeamEmployee,
			);

			const teamEmployee = await this.teamEmployeeRepository.findOne({
				where: { id: createTeamEmployee.id },
				relations: ['employee_info', 'employee_info.designation_info', 'employee_info.user_info', 'team_info'],
			});


			return teamEmployee;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findAllList() {
		try {
			// find all active team-employees
			const teamEmployees = await this.teamEmployeeRepository.findAndCount({
				status: 1,
			});

			return teamEmployees;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findOne(id: string): Promise<TeamEmployeeEntity> {
		try {
			// find single team-employee
			const teamEmployee = await this.teamEmployeeRepository.findOne({
				where: { id },
				relations: ['employee_info', 'team_info'],
			});

			if (!teamEmployee) {
				throw new NotFoundException('No team-employee found on this id!');
			}
			return teamEmployee;
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
			// find team-employee
			const findTeamEmployee = await this.teamEmployeeRepository.findOne(id);

			if (!findTeamEmployee) {
				throw new NotFoundException('No team-employee found on this id!');
			}

			// update single team-employee
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

			const TeamEmployee = await this.teamEmployeeRepository.findOne({
				where: { id },
				relations: ['employee_info', 'team_info'],
			});

			return TeamEmployee;
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
			// find team-employee
			const findTeamEmployee = await this.teamEmployeeRepository.findOne(id);

			if (!findTeamEmployee) {
				throw new NotFoundException('No team-employee found on this id!');
			}

			// update team-employee status
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
			// find team-employee
			const teamEmployee = await this.teamEmployeeRepository.findOne({
				id: id,
			});

			if (!teamEmployee) {
				throw new NotFoundException('No team-employee found on this id!');
			}

			await this.connection.transaction(async (manager) => {
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
			// find team-employee
			const teamEmployee = await this.teamEmployeeRepository.find({
				where: { id },
				withDeleted: true,
			});

			if (!teamEmployee) {
				throw new NotFoundException('No team-employee found on this id!');
			}

			await this.teamEmployeeRepository.delete(id);

			return true;
		} catch (error) {
			throw new CustomException(error);
		}
	}
}
