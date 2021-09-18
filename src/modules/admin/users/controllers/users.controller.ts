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
import { CreateUserDto } from '../dto/create-user.dto';
import { StatusChangeUserDto } from '../dto/status-change-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterListDto } from '../dto/user-filter-list.dto';
import { UserIdParamDto } from '../dto/user-id-param.dto';
import { UsersService } from '../services/users.service';

@Controller('v1/admin/users')
@ApiTags('Admin Users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	/*
		fetch all users
		return an array of objects
	*/
	@Get()
	@ApiResponse({ description: 'Get all users', status: HttpStatus.OK })
	async findAll(
		@Query() filter: UserFilterListDto,
		@Pagination() pagination: PaginationDto,
	) {
		const [users, total] = await this.usersService.findAll(filter, pagination);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All users fetched successfully',
			metadata: {
				page: pagination.page,
				totalCount: total,
				limit: pagination.limit,
			},
			data: { users },
		});
	}

	/*
		create new user
		return single object
	*/
	@Post()
	@ApiResponse({ description: 'Create new user', status: HttpStatus.OK })
	@ApiBody({ type: CreateUserDto })
	async create(
		@AdminUser() adminUser: AdminUserDto,
		@Body(new DtoValidationPipe()) createUserDto: CreateUserDto,
		@TransactionManager() manager: EntityManager,
	) {
		const user = await this.usersService.create(createUserDto, adminUser);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'User created Successfully',
			data: { user },
		});
	}

	/*
		fetch all active users
		return an array of objects
	*/
	@Get('/list')
	@ApiResponse({ description: 'Get only active users', status: HttpStatus.OK })
	async findAllList() {
		const [users] = await this.usersService.findAllList();
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All Active user fetched successfully',
			data: { users },
		});
	}

	/*
		fetch single user
		return single object
	*/
	@Get(':id')
	@ApiResponse({ description: 'Single user fetched', status: HttpStatus.OK })
	async findOne(@Param(new DtoValidationPipe()) params: UserIdParamDto) {
		const user = await this.usersService.findOne(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Single user fetched successfully',
			data: { user },
		});
	}

	/*
		update single user
		return single object
	*/
	@Put(':id')
	@ApiResponse({ description: 'Single user updated', status: HttpStatus.OK })
	async update(
		@AdminUser() adminUser: AdminUserDto,
		@Param(new DtoValidationPipe()) params: UserIdParamDto,
		@Body(new DtoValidationPipe()) updateUserDto: UpdateUserDto,
	) {
		const user = await this.usersService.update(
			params.id,
			updateUserDto,
			adminUser,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Single user updated successfully',
			data: { user },
		});
	}

	/*
		update user status
		return single object
	*/
	@Patch(':id/status')
	@ApiResponse({
		description: 'Single user status updated',
		status: HttpStatus.OK,
	})
	async status(
		@AdminUser() adminUser: AdminUserDto,
		@Param(new DtoValidationPipe()) params: UserIdParamDto,
		@Body(new DtoValidationPipe())
		statusChangeUserDto: StatusChangeUserDto,
	) {
		const user = await this.usersService.status(
			params.id,
			statusChangeUserDto,
			adminUser,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'User status updated successfully',
			data: { user },
		});
	}

	/*
		delete single user - soft delete
		return null
	*/
	@Delete(':id')
	@ApiResponse({ description: 'Single user deleted', status: HttpStatus.OK })
	async remove(
		@AdminUser() adminUser: AdminUserDto,
		@Param(new DtoValidationPipe()) params: UserIdParamDto,
	) {
		await this.usersService.remove(params.id, adminUser);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'User soft deleted',
			data: {},
		});
	}

	/*
		delete single user - hard/permanent delete
		return null
	*/
	@Delete('/:id/delete')
	@ApiResponse({
		description: 'Single user deleted permanently',
		status: HttpStatus.OK,
	})
	async finalDelete(@Param(new DtoValidationPipe()) params: UserIdParamDto) {
		await this.usersService.finalDelete(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'User completely deleted',
			data: {},
		});
	}
}
