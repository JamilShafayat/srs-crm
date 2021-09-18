import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UseGuards
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AdminUser } from 'src/common/decorators/Admin/admin-user.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { AuthGuard } from 'src/common/guard/admin/auth.guard';
import { DtoValidationPipe } from 'src/common/pipes/dtoValidation.pipe';
import { EntityManager, TransactionManager } from 'typeorm';
import { CreateTeamEmployeeDto } from '../dto/create-team-employee.dto';
import { StatusChangeTeamEmployeeDto } from '../dto/status-change-team-employee.dto';
import { TeamEmployeeIdParamDto } from '../dto/team-employee-id-param.dto';
import { TeamEmployeeListDto } from '../dto/team-employee-list.dto';
import { UpdateTeamEmployeeDto } from '../dto/update-team-employee.dto';
import { TeamEmployeeService } from '../services/team-employee.service';

@Controller('v1/admin/team_employees')
@ApiTags('Team Employee')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class TeamEmployeeController {
	constructor(private readonly teamEmployeeService: TeamEmployeeService) { }

	/*
		fetch all team-employees
		return an array of objects
	*/
	@Get()
	@ApiResponse({ description: 'Get all team-employees', status: HttpStatus.OK })
	async findAll(
		@Query() filter: TeamEmployeeListDto,
		@Pagination() pagination: PaginationDto,
	) {
		const [teamEmployees, total] = await this.teamEmployeeService.findAll(
			filter,
			pagination,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All team-employees fetched successfully',
			metadata: {
				page: pagination.page,
				totalCount: total,
				limit: pagination.limit,
			},
			data: { teamEmployees },
		});
	}

	/*
		create new team-employee
		return single object
	*/
	@Post()
	@ApiResponse({
		description: 'Create new team-employee',
		status: HttpStatus.CREATED,
	})
	@ApiBody({ type: CreateTeamEmployeeDto })
	async create(
		@AdminUser() user: AdminUserDto,
		@Body(new DtoValidationPipe()) createTeamEmployeeDto: CreateTeamEmployeeDto,
		@TransactionManager() manager: EntityManager,
	) {
		const teamEmployee = await this.teamEmployeeService.create(
			createTeamEmployeeDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.CREATED,
			message: 'Team-employee created successfully',
			data: { teamEmployee },
		});
	}

	/*
		fetch all active team-employees
		return an array of objects
	*/
	@Get('/list')
	@ApiResponse({
		description: 'Get only active team-employees',
		status: HttpStatus.OK,
	})
	async findAllList() {
		const [teamEmployees] = await this.teamEmployeeService.findAllList();
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All active team-employees fetched successfully',
			data: { teamEmployees },
		});
	}

	/*
		fetch single team-employee
		return single object
	*/
	@Get(':id')
	@ApiResponse({
		description: 'Single team-employee fetched',
		status: HttpStatus.OK,
	})
	async findOne(
		@Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
	) {
		const teamEmployee = await this.teamEmployeeService.findOne(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Single team-employee fetched successfully',
			data: { teamEmployee },
		});
	}

	/*
		update single team-employee
		return single object
	*/
	@Put(':id')
	@ApiResponse({
		description: 'Single team-employee updated',
		status: HttpStatus.OK,
	})
	async update(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
		@Body(new DtoValidationPipe()) updateTeamEmployeeDto: UpdateTeamEmployeeDto,
	) {
		const teamEmployee = await this.teamEmployeeService.update(
			params.id,
			updateTeamEmployeeDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Team-employee updated successfully',
			data: { teamEmployee },
		});
	}

	/*
		update team-employee status
		return single object
	*/
	@Patch(':id/status')
	@ApiResponse({
		description: 'Single team-employee status updated',
		status: HttpStatus.OK,
	})
	async status(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
		@Body(new DtoValidationPipe())
		statusChangeTeamEmployeeDto: StatusChangeTeamEmployeeDto,
	) {
		const teamEmployee = await this.teamEmployeeService.status(
			params.id,
			statusChangeTeamEmployeeDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Team-employee status updated successfully',
			data: { teamEmployee },
		});
	}

	/*
		delete single team-employee - soft delete
		return null
	*/
	@Delete(':id')
	@ApiResponse({
		description: 'Single team-employee deleted',
		status: HttpStatus.OK,
	})
	async remove(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
	) {
		await this.teamEmployeeService.remove(params.id, user);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Team-employee soft deleted',
			data: {},
		});
	}

	/*
		delete single team-employee - hard/permanent delete
		return null
	*/
	@Delete('/:id/delete')
	@ApiResponse({
		description: 'Single team-employee deleted permanently',
		status: HttpStatus.OK,
	})
	async finalDelete(
		@Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
	) {
		await this.teamEmployeeService.finalDelete(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Team-employee completely deleted',
			data: {},
		});
	}
}
