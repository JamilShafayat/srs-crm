import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { DesignationEntity } from 'src/common/entities/designation.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateDesignationDto } from '../dto/create-designation.dto';
import { DesignationListDto } from '../dto/designation-list.dto';
import { StatusChangeDesignationDto } from '../dto/status-change-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation-dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(DesignationEntity)
    private readonly designationRepository: Repository<DesignationEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: DesignationListDto,
    pagination: PaginationDto,
  ): Promise<[DesignationEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //find designations
      const designations = await this.designationRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
      });

      const total = await this.designationRepository.count({
        where: { ...whereCondition },
      });

      return [designations, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createDesignationDto: CreateDesignationDto, user: AdminUserDto) {
    try {
      const { name } = createDesignationDto;

      //find existing designation
      const findDesignation = await this.designationRepository.findOne({
        name,
      });

      // If found designation
      if (findDesignation) {
        throw new ValidationException([
          {
            field: 'name',
            message: 'This designation name already exists in the system.',
          },
        ]);
      }

      const createDesignation = {
        name,
        created_by: user.id,
      };

      const designation = await this.designationRepository.save(
        createDesignation,
      );

      return designation;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // find all active designations
      const designations = await this.designationRepository.findAndCount({
        status: 1,
      });

      return designations;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<DesignationEntity> {
    try {
      // find single designation
      const designation = await this.designationRepository.findOne({
        where: { id },
      });

      if (!designation) {
        throw new NotFoundException('No designation found on this id!');
      }
      return designation;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(
    id: string,
    updateDesignationDto: UpdateDesignationDto,
    user: AdminUserDto,
  ) {
    try {
      // update single designation
      await this.designationRepository.update(
        {
          id: id,
        },
        {
          name: updateDesignationDto.name,
          updated_by: user.id,
        },
      );

      const designation = await this.designationRepository.findOne(id);

      return designation;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeDesignationDto: StatusChangeDesignationDto,
    user: AdminUserDto,
  ) {
    try {
      // find designation
      const findDesignation = await this.designationRepository.findOne(id);

      if (!findDesignation) {
        throw new NotFoundException('No designation found on this id!');
      }

      //update designation Status
      await this.designationRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeDesignationDto.status,
          updated_by: user.id,
        },
      );

      const designation = await this.designationRepository.findOne(id);

      return designation;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // find designation
      const findDesignation = await this.designationRepository.findOne({
        id: id,
      });

      if (!findDesignation) {
        throw new NotFoundException('No designation found on this id!');
      }

      await this.connection.transaction(async (manager) => {
        await manager.getRepository<DesignationEntity>('designations').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        await manager
          .getRepository<DesignationEntity>('designations')
          .softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // find designation
      const designation = await this.designationRepository.find({
        where: { id },
        withDeleted: true,
      });

      if (!designation) {
        throw new NotFoundException('No designation found on this id!');
      }

      await this.designationRepository.delete(id);

      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
