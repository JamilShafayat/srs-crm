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
import { CreateDesignationDto } from '../dto/create-designation.dto';
import { DesignationIdParamDto } from '../dto/designation-id-param.dto';
import { DesignationListDto } from '../dto/designation-list.dto';
import { StatusChangeDesignationDto } from '../dto/status-change-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation-dto';
import { DesignationService } from '../services/designation.service';

@Controller('v1/admin/designations')
@ApiTags('Designation')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class DesignationController {
	constructor(private readonly designationService: DesignationService) { }

	/*
		fetch all designations
		return an array of objects
	*/
	@Get()
	@ApiResponse({ description: 'Get all designations', status: HttpStatus.OK })
	async findAll(
		@Query() filter: DesignationListDto,
		@Pagination() pagination: PaginationDto,
	) {
		const [designations, total] = await this.designationService.findAll(
			filter,
			pagination,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All designation fetched successfully',
			metadata: {
				page: pagination.page,
				totalCount: total,
				limit: pagination.limit,
			},
			data: { designations },
		});
	}

	/*
		create new designation
		return single object
	*/
	@Post()
	@ApiResponse({ description: 'Create new client', status: HttpStatus.CREATED })
	@ApiBody({ type: CreateDesignationDto })
	async create(
		@AdminUser() user: AdminUserDto,
		@Body(new DtoValidationPipe()) createDesignationDto: CreateDesignationDto,
		@TransactionManager() manager: EntityManager,
	) {
		const designation = await this.designationService.create(
			createDesignationDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.CREATED,
			message: 'Designation created successfully',
			data: { designation },
		});
	}

	/*
		fetch all active designations
		return an array of objects
	*/
	@Get('/list')
	@ApiResponse({
		description: 'Get only active designations',
		status: HttpStatus.OK,
	})
	async findAllList() {
		const [designations] = await this.designationService.findAllList();
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All active designations fetched successfully',
			data: { designations },
		});
	}

	/*
		fetch single designation
		return single object
	*/
	@Get(':id')
	@ApiResponse({
		description: 'Single designation fetched',
		status: HttpStatus.OK,
	})
	async findOne(@Param(new DtoValidationPipe()) params: DesignationIdParamDto) {
		const designation = await this.designationService.findOne(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Single designation fetched successfully',
			data: { designation },
		});
	}

	/*
		update single designation
		return single object
	*/
	@Put(':id')
	@ApiResponse({
		description: 'Single designation updated',
		status: HttpStatus.OK,
	})
	async update(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: DesignationIdParamDto,
		@Body(new DtoValidationPipe()) updateDesignationDto: UpdateDesignationDto,
	) {
		const designation = await this.designationService.update(
			params.id,
			updateDesignationDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Designation updated successfully',
			data: { designation },
		});
	}

	/*
		update designation status
		return single object
	*/
	@Patch(':id/status')
	@ApiResponse({
		description: 'Single designation status changed',
		status: HttpStatus.OK,
	})
	async status(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: DesignationIdParamDto,
		@Body(new DtoValidationPipe())
		statusChangeDesignationDto: StatusChangeDesignationDto,
	) {
		const designation = await this.designationService.status(
			params.id,
			statusChangeDesignationDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Designation status updated successfully',
			data: { designation },
		});
	}

	/*
		delete single designation - soft delete
		return null
	*/
	@Delete(':id')
	@ApiResponse({
		description: 'Single designation deleted',
		status: HttpStatus.OK,
	})
	async remove(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: DesignationIdParamDto,
	) {
		await this.designationService.remove(params.id, user);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Designation soft deleted',
			data: {},
		});
	}

	/*
		delete single designation - hard/permanent delete
		return null
	*/
	@Delete('/:id/delete')
	@ApiResponse({
		description: 'Single designation deleted permanently',
		status: HttpStatus.OK,
	})
	async finalDelete(
		@Param(new DtoValidationPipe()) params: DesignationIdParamDto,
	) {
		await this.designationService.finalDelete(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Designation completely deleted',
			data: {},
		});
	}
}
