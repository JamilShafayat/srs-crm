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

      //count total categories
      const total = await this.designationRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [designations, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createDesignationDto: CreateDesignationDto, user: AdminUserDto) {
    try {
      const { name } = createDesignationDto;

      //find existing designation
      const findExisting = await this.designationRepository.findOne({ name });

      // If found designation
      if (findExisting) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'name',
            message: 'This Designation Name Already Exists.',
          },
        ]);
      }

      const data = {
        name,
        created_by: user.id,
      };

      // Designation store
      const addedDesignationData = await this.designationRepository.save(data);

      // Created Data Return
      return addedDesignationData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.designationRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<DesignationEntity> {
    try {
      // Single Designation Fetch
      const expectedData = await this.designationRepository.findOne({
        where: { id },
      });

      // Designation not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }
      return expectedData;
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
      //update data
      await this.designationRepository.update(
        {
          id: id,
        },
        {
          name: updateDesignationDto.name,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const designationData = await this.designationRepository.findOne(id);

      //return updated row
      return designationData;
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
      // Find data
      const expectedData = await this.designationRepository.findOne(id);

      // data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //update data Status
      await this.designationRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeDesignationDto.status,
          updated_by: user.id,
        },
      );

      const test = await this.designationRepository.findOne(id);

      return test;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find test
      const expectedData = await this.designationRepository.findOne({ id: id });

      // Test not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Test Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<DesignationEntity>('designations').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //Soft Delete Test
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
      // Find test data
      const expectedData = await this.designationRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //Delete data
      await this.designationRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
