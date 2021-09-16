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
import { CommentFilterListDto } from '../dto/comment-filter-list.dto';
import { CommentIdParamDto } from '../dto/comment-id-param.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { StatusChangeCommentDto } from '../dto/status-change-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentService } from '../services/comment.service';

@Controller('v1/admin/comments')
@ApiTags('Comment')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class CommentController {
	constructor(private readonly commentService: CommentService) { }

	/*
		fetch all comments
		return an array of objects
	*/
	@Get()
	@ApiResponse({ description: 'Get all comments', status: HttpStatus.OK })
	async findAll(
		@Query() filter: CommentFilterListDto,
		@Pagination() pagination: PaginationDto,
	) {
		const [comments, total] = await this.commentService.findAll(
			filter,
			pagination,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All comment fetched successfully',
			metadata: {
				page: pagination.page,
				totalCount: total,
				limit: pagination.limit,
			},
			data: { comments },
		});
	}

	/*
		create new comment
		return single object
	*/
	@Post()
	@ApiResponse({ description: 'Create new comment', status: HttpStatus.OK })
	@ApiBody({ type: CreateCommentDto })
	async create(
		@AdminUser() user: AdminUserDto,
		@Body(new DtoValidationPipe())
		createCommentDto: CreateCommentDto,
		@TransactionManager() manager: EntityManager,
	) {
		const comment = await this.commentService.create(createCommentDto, user);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.CREATED,
			message: 'Comment created successfully',
			data: { comment },
		});
	}

	/*
		fetch all active comment
		return an array of objects
	*/
	@Get('/list')
	@ApiResponse({
		description: 'Get only active comment',
		status: HttpStatus.OK,
	})
	async findAllList() {
		const [comments] = await this.commentService.findAllList();
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'All active comment fetched successfully',
			data: { comments },
		});
	}

	/*
		fetch single comment
		return single object
	*/
	@Get(':id')
	@ApiResponse({
		description: 'Single comment fetched',
		status: HttpStatus.OK,
	})
	async findOne(@Param(new DtoValidationPipe()) params: CommentIdParamDto) {
		const comment = await this.commentService.findOne(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Single comment fetched successfully',
			data: { comment },
		});
	}

	/*
		update single comment
		return single object
	*/
	@Put(':id')
	@ApiResponse({
		description: 'Single comment updated',
		status: HttpStatus.OK,
	})
	async update(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: CommentIdParamDto,
		@Body(new DtoValidationPipe()) updateCommentDto: UpdateCommentDto,
	) {
		const comment = await this.commentService.update(
			params.id,
			updateCommentDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Comment updated successfully',
			data: { comment },
		});
	}

	/*
		update comment status
		return single object
	*/
	@Patch(':id/status')
	@ApiResponse({
		description: 'Single comment status changed',
		status: HttpStatus.OK,
	})
	async status(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: CommentIdParamDto,
		@Body(new DtoValidationPipe())
		statusChangeCommentDto: StatusChangeCommentDto,
	) {
		const comment = await this.commentService.status(
			params.id,
			statusChangeCommentDto,
			user,
		);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Comment status updated successfully',
			data: { comment },
		});
	}

	/*
		delete single comment - soft delete
		return null
	*/
	@Delete(':id')
	@ApiResponse({
		description: 'Single comment deleted',
		status: HttpStatus.OK,
	})
	async remove(
		@AdminUser() user: AdminUserDto,
		@Param(new DtoValidationPipe()) params: CommentIdParamDto,
	) {
		await this.commentService.remove(params.id, user);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Comment soft deleted',
			data: {},
		});
	}

	/*
		delete single comment - hard/permanent delete
		return null
	*/
	@Delete('/:id/delete')
	@ApiResponse({
		description: 'Single comment deleted permanently',
		status: HttpStatus.OK,
	})
	async finalDelete(@Param(new DtoValidationPipe()) params: CommentIdParamDto) {
		await this.commentService.finalDelete(params.id);
		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'Comment completely deleted',
			data: {},
		});
	}
}
