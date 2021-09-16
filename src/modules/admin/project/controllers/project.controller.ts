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
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectFilterListDto } from '../dto/project-filter-list.dto';
import { ProjectIdParamDto } from '../dto/project-id-param.dto';
import { StatusChangeProjectDto } from '../dto/status-change-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectService } from '../services/project.service';

@Controller('v1/admin/projects')
@ApiTags('Project')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class ProjectController {
	constructor(private readonly projectService: ProjectService) { }

	/*
		fetch all projects
		return an array of objects
	*/
	@Get()
	@ApiResponse({ description: 'Get all projects', status: HttpStatus.OK })
	async findAll(
		@Query() filter: ProjectFilterListDto,
		@Pagination() pagination: PaginationDto,
	) {
		const [projects, total] = await this.projectService.findAll(
			filter,
			pagination,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All project fetched successfully',
			metadata: {
				page: pagination.page,
				totalCount: total,
				limit: pagination.limit,
			},
			data: { projects },
		});
	}

	/*
		create new project
		return single object
	*/
	@Post()
	@ApiResponse({ description: 'Create new project', status: HttpStatus.CREATED })
	@ApiBody({ type: CreateProjectDto })
	async create(
		@AdminUser() user: AdminUserDto,
		@Body(new DtoValidationPipe())
		createProjectDto: CreateProjectDto,
		@TransactionManager() manager: EntityManager,
	) {
		const project = await this.projectService.create(createProjectDto, user);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.CREATED,
			message: 'Project created successfully',
			data: { project },
		});
	}

	/*
		fetch all active projects
		return an array of objects
	*/
	@Get('/list')
	@ApiResponse({
		description: 'Get only active project',
		status: HttpStatus.OK,
	})
	async findAllList() {
		const [projects] = await this.projectService.findAllList();
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All active project fetched successfully',
			data: { projects },
		});
	}

	/*
		fetch single project
		return single object
	*/
	@Get(':id')
	@ApiResponse({
		description: 'Single project fetched',
		status: HttpStatus.OK,
	})
	async findOne(@Param(new DtoValidationPipe()) params: ProjectIdParamDto) {
		const project = await this.projectService.findOne(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Single project fetched successfully',
			data: { project },
		});
	}

	/*
		update single project
		return single object
	*/
	@Put(':id')
	@ApiResponse({
		description: 'Single project updated',
		status: HttpStatus.OK,
	})
	async update(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: ProjectIdParamDto,
		@Body(new DtoValidationPipe()) updateProjectDto: UpdateProjectDto,
	) {
		const project = await this.projectService.update(
			params.id,
			updateProjectDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Project updated successfully',
			data: { project },
		});
	}

	/*
		update project status
		return single object
	*/
	@Patch(':id/status')
	@ApiResponse({
		description: 'Single project status updated',
		status: HttpStatus.OK,
	})
	async status(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: ProjectIdParamDto,
		@Body(new DtoValidationPipe())
		statusChangeProjectDto: StatusChangeProjectDto,
	) {
		const project = await this.projectService.status(
			params.id,
			statusChangeProjectDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Project status updated successfully',
			data: { project },
		});
	}

	/*
		delete single project - soft delete
		return null
	*/
	@Delete(':id')
	@ApiResponse({
		description: 'Single project deleted',
		status: HttpStatus.OK,
	})
	async remove(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: ProjectIdParamDto,
	) {
		await this.projectService.remove(params.id, user);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Project soft deleted',
			data: {},
		});
	}

	/*
		delete single project - hard/permanent delete
		return null
	*/
	@Delete('/:id/delete')
	@ApiResponse({
		description: 'Single project deleted permanently',
		status: HttpStatus.OK,
	})
	async finalDelete(@Param(new DtoValidationPipe()) params: ProjectIdParamDto) {
		await this.projectService.finalDelete(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Project completely deleted',
			data: {},
		});
	}
}
