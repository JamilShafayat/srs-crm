import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { AdminUserEntity } from 'src/common/entities/admin/users/user.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { Connection, Equal, Not, Repository } from 'typeorm';
import { AdminUserListDto } from '../dto/admin-user-list.dto';
import { CreateAdminUserDto } from '../dto/create-user.dto';
import { StatusChangeAdminUserDto } from '../dto/status-change-user.dto';
import { UpdateAdminUserDto } from '../dto/update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: AdminUserListDto,
    pagination: PaginationDto,
  ): Promise<[AdminUserEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //state filter
      if (filter.phone) {
        whereCondition['phone'] = Equal(filter.phone);
      }

      //find users
      const users = await this.adminUserRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
      });

      //count total categories
      const total = await this.adminUserRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [users, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(
    createAdminUserDto: CreateAdminUserDto,
    adminUser: AdminUserDto,
  ) {
    try {
      const { full_name, phone, password, user_type } = createAdminUserDto;

      //find Existing Entry
      const findExisting = await this.adminUserRepository.findOne({ phone });

      // Entry if found
      if (findExisting) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'phone',
            message: 'User Already  Exists.',
          },
        ]);
      }

      //Data store
      const hashedPassword = await bcrypt.hash(password, 12);
      const data = {
        full_name,
        phone,
        user_type,
        password: hashedPassword,
        created_by: adminUser.id,
      };

      const addedUserData = await this.adminUserRepository.save(data);

      // Created Data Return
      return addedUserData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.adminUserRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<AdminUserEntity> {
    try {
      // Single User Fetch
      const expectedData = await this.adminUserRepository.findOne({
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

  async update(
    id: string,
    updateAdminUserDto: UpdateAdminUserDto,
    adminUser: AdminUserDto,
  ) {
    try {
      // Find Data
      const whereCondition = {};
      whereCondition['phone'] = Equal(updateAdminUserDto.phone);
      whereCondition['id'] = Not(Equal(id));
      const udEexpectedData = await this.adminUserRepository.findOne({
        where: { ...whereCondition },
      });

      // Data found throw an error.
      if (udEexpectedData) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'phone',
            message: 'Phone Number Already  Exists with another User.',
          },
        ]);
      }

      //update data
      await this.adminUserRepository.update(
        {
          id: id,
        },
        {
          full_name: updateAdminUserDto.full_name,
          phone: updateAdminUserDto.phone,
          updated_by: adminUser.id,
        },
      );

      // Updated row getting
      const user = await this.adminUserRepository.findOne(id);

      //return updated row
      return user;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeAdminUserDto: StatusChangeAdminUserDto,
    adminUser: AdminUserDto,
  ) {
    try {
      // Find user
      const expectedData = await this.adminUserRepository.findOne(id);

      // user not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //update user Status
      await this.adminUserRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeAdminUserDto.status,
          updated_by: adminUser.id,
        },
      );

      // Updated user Fetch
      const user = await this.adminUserRepository.findOne(id);

      //return updated user
      return user;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, adminUser: AdminUserDto) {
    try {
      // Find User
      const expectedData = await this.adminUserRepository.findOne({ id: id });

      // User not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No User Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<AdminUserEntity>('admin_users').update(
          {
            id: id,
          },
          {
            deleted_by: adminUser.id,
          },
        );

        //Soft Delete User
        await manager
          .getRepository<AdminUserEntity>('admin_users')
          .softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find Admin User Data
      const expectedData = await this.adminUserRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //Delete data
      await this.adminUserRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
