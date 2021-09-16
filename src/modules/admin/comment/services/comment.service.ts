import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { CommentEntity } from 'src/common/entities/comment.entity';
import { ComplaintEntity } from 'src/common/entities/complaint.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { CommentFilterListDto } from '../dto/comment-filter-list.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { StatusChangeCommentDto } from '../dto/status-change-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(ComplaintEntity)
		private readonly complaintRepository: Repository<ComplaintEntity>,
		@InjectRepository(CommentEntity)
		private readonly commentRepository: Repository<CommentEntity>,
		private connection: Connection,
	) { }

	async findAll(
		filter: CommentFilterListDto,
		pagination: PaginationDto,
	): Promise<[CommentEntity[], number]> {
		try {
			const whereCondition = {};

			//status filter
			if (filter.status) {
				whereCondition['status'] = Equal(filter.status);
			}

			//find comments
			const comments = await this.commentRepository.find({
				where: {
					...whereCondition,
				},
				order: { created_by: 'DESC' },
				skip: pagination.skip,
				take: pagination.limit,
				relations: ['user_info', 'complaint_info'],
			});

			const total = await this.commentRepository.count({
				where: { ...whereCondition },
			});

			return [comments, total];
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async create(createCommentDto: CreateCommentDto, user: AdminUserDto) {
		try {
			const { body, user_id, complaint_id } = createCommentDto;

			// find user
			const findUser = await this.userRepository.findOne({
				where: { id: user_id },
			});

			if (!findUser) {
				throw new NotFoundException('No user found on this id!');
			}

			// find complaint
			const findComplaint = await this.complaintRepository.findOne({
				where: { id: complaint_id },
			});

			if (!findComplaint) {
				throw new NotFoundException('No complaint found on this id!');
			}

			const newComment = {
				body,
				user_id,
				complaint_id,
				created_by: user.id,
			};

			const createComment = await this.commentRepository.save(newComment);

			const comment = await this.commentRepository.findOne({
				where: { id: createComment.id },
				relations: ['user_info', 'complaint_info'],
			});

			return comment;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findAllList() {
		try {
			// find all active comments
			const comments = await this.commentRepository.findAndCount({
				status: 1,
			});

			return comments;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findOne(id: string): Promise<CommentEntity> {
		try {
			// find single comment
			const comment = await this.commentRepository.findOne({
				where: { id },
				relations: ['user_info', 'complaint_info'],
			});

			if (!comment) {
				throw new NotFoundException('No comment found on this id!');
			}
			return comment;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async update(
		id: string,
		updateCommentDto: UpdateCommentDto,
		user: AdminUserDto,
	) {
		try {
			// find comment
			const findComment = await this.commentRepository.findOne(id);

			if (!findComment) {
				throw new NotFoundException('No comment found on this id!');
			}

			await this.commentRepository.update(
				{
					id: id,
				},
				{
					body: updateCommentDto.body,
					user_id: updateCommentDto.user_id,
					complaint_id: updateCommentDto.complaint_id,
					updated_by: user.id,
				},
			);

			const comment = await this.commentRepository.findOne({
				where: { id },
				relations: ['user_info', 'complaint_info'],
			});

			return comment;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async status(
		id: string,
		statusChangeCommentDto: StatusChangeCommentDto,
		user: AdminUserDto,
	) {
		try {
			// find comment
			const findComment = await this.commentRepository.findOne(id);

			if (!findComment) {
				throw new NotFoundException('No Comment Found!');
			}

			await this.commentRepository.update(
				{
					id: id,
				},
				{
					status: statusChangeCommentDto.status,
					updated_by: user.id,
				},
			);

			const comment = await this.commentRepository.findOne(id);

			return comment;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async remove(id: string, user: AdminUserDto) {
		try {
			// find comment
			const comment = await this.commentRepository.findOne({ id: id });

			if (!comment) {
				throw new NotFoundException('No Comment Found!');
			}

			await this.connection.transaction(async (manager) => {
				await manager.getRepository<CommentEntity>('comments').update(
					{
						id: id,
					},
					{
						deleted_by: user.id,
					},
				);

				await manager.getRepository<CommentEntity>('comments').softDelete(id);
				return true;
			});
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async finalDelete(id: string) {
		try {
			// find comment
			const comment = await this.commentRepository.find({
				where: { id },
				withDeleted: true,
			});

			if (!comment) {
				throw new NotFoundException('No Comment Found!');
			}

			await this.commentRepository.delete(id);

			return true;
		} catch (error) {
			throw new CustomException(error);
		}
	}
}
