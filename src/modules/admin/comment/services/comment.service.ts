import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { CommentEntity } from 'src/common/entities/comment.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { CommentFilterListDto } from '../dto/comment-filter-list.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { StatusChangeCommentDto } from '../dto/status-change-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private connection: Connection,
  ) {}

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

      //state filter
      // if (filter.phone) {
      //   whereCondition['phone'] = Equal(filter.phone);
      // }

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

      //count total comments
      const total = await this.commentRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [comments, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createCommentDto: CreateCommentDto, user: AdminUserDto) {
    try {
      const { body, user_id, complaint_id } = createCommentDto;

      //data store
      const data = {
        body,
        user_id,
        complaint_id,
        created_by: user.id,
      };

      const addedCommentData = await this.commentRepository.save(data);

      // Created data return
      return addedCommentData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.commentRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<CommentEntity> {
    try {
      // single comment fetch
      const expectedData = await this.commentRepository.findOne({
        where: { id },
        relations: ['user_info', 'complaint_info'],
      });

      // comment not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Comment Found!');
      }
      return expectedData;
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
      //update data
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

      // Updated row getting
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user_info', 'complaint_info'],
      });

      //return updated row
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
      // Find comment
      const expectedData = await this.commentRepository.findOne(id);

      // comment not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Comment Found!');
      }

      //update comment status
      await this.commentRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeCommentDto.status,
          updated_by: user.id,
        },
      );

      // Updated comment fetch
      const comment = await this.commentRepository.findOne(id);

      //return updated comment
      return comment;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find comment
      const expectedData = await this.commentRepository.findOne({ id: id });

      // comment not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Comment Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<CommentEntity>('comments').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //Soft delete comment
        await manager.getRepository<CommentEntity>('comments').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find comment
      const expectedData = await this.commentRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Comment Found!');
      }

      //Delete data
      await this.commentRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
