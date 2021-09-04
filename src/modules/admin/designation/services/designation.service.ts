import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { DesignationEntity } from 'src/common/entities/designation.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { CreateTestDto } from '../dto/create-test.dto';
import { StatusChangeTestDto } from '../dto/status-change-test.dto';
import { TestListDto } from '../dto/test-list.dto';
import { UpdateTestDto } from '../dto/update-test-dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(DesignationEntity)
    private readonly designationRepository: Repository<DesignationEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: TestListDto,
    pagination: PaginationDto,
  ): Promise<[DesignationEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //find users
      const users = await this.designationRepository.find({
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
      return [users, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createTestDto: CreateTestDto, test: AdminUserDto) {
    try {
      const { name, type } = createTestDto;

      const data = {
        name,
        type,
        created_by: test.id,
      };

      const addedTestData = await this.designationRepository.save(data);

      // Created Data Return
      return addedTestData;
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
      // Single User Fetch
      const expectedData = await this.designationRepository.findOne({
        where: { id },
      });

      // User not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(id: string, updateTestDto: UpdateTestDto, test: AdminUserDto) {
    try {
      //update data
      await this.designationRepository.update(
        {
          id: id,
        },
        {
          name: updateTestDto.name,
          type: updateTestDto.type,
          updated_by: test.id,
        },
      );

      // Updated row getting
      const testData = await this.designationRepository.findOne(id);

      //return updated row
      return testData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeTestDto: StatusChangeTestDto,
    adminUser: AdminUserDto,
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
          status: statusChangeTestDto.status,
          updated_by: adminUser.id,
        },
      );

      const test = await this.designationRepository.findOne(id);

      return test;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, adminUser: AdminUserDto) {
    try {
      // Find test
      const expectedData = await this.designationRepository.findOne({ id: id });

      // Test not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Test Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<DesignationEntity>('admin_users').update(
          {
            id: id,
          },
          {
            deleted_by: adminUser.id,
          },
        );

        //Soft Delete Test
        await manager
          .getRepository<DesignationEntity>('admin_users')
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
