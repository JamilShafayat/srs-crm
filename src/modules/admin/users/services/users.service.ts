import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { UserEntity } from 'src/common/entities/user.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { Connection, Equal, Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { StatusChangeUserDto } from '../dto/status-change-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterListDto } from '../dto/user-filter-list.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: UserFilterListDto,
    pagination: PaginationDto,
  ): Promise<[UserEntity[], number]> {
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
      const users = await this.userRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
      });

      //count total categories
      const total = await this.userRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [users, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createUserDto: CreateUserDto, adminUser: AdminUserDto) {
    try {
      const { name, phone, password, user_type } = createUserDto;

      //find Existing Entry
      const findExisting = await this.userRepository.findOne({ phone });

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
        name,
        phone,
        user_type,
        password: hashedPassword,
        created_by: adminUser.id,
      };

      const addedUserData = await this.userRepository.save(data);

      // Created Data Return
      return addedUserData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.userRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      // Single User Fetch
      const expectedData = await this.userRepository.findOne({
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
    updateUserDto: UpdateUserDto,
    adminUser: AdminUserDto,
  ) {
    try {
      // Find Data
      const whereCondition = {};
      whereCondition['phone'] = Equal(updateUserDto.phone);
      whereCondition['id'] = Not(Equal(id));
      const unEexpectedData = await this.userRepository.findOne({
        where: { ...whereCondition },
      });

      // Data found throw an error.
      if (unEexpectedData) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'phone',
            message: 'Phone Number Already Exists with another User.',
          },
        ]);
      }

      //update data
      await this.userRepository.update(
        {
          id: id,
        },
        {
          name: updateUserDto.name,
          phone: updateUserDto.phone,
          updated_by: adminUser.id,
        },
      );

      // Updated row getting
      const user = await this.userRepository.findOne(id);

      //return updated row
      return user;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeUserDto: StatusChangeUserDto,
    adminUser: AdminUserDto,
  ) {
    try {
      // Find user
      const expectedData = await this.userRepository.findOne(id);

      // user not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //update user Status
      await this.userRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeUserDto.status,
          updated_by: adminUser.id,
        },
      );

      // Updated user Fetch
      const user = await this.userRepository.findOne(id);

      //return updated user
      return user;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, adminUser: AdminUserDto) {
    try {
      // Find User
      const expectedData = await this.userRepository.findOne({ id: id });

      // User not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No User Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<UserEntity>('admin_users').update(
          {
            id: id,
          },
          {
            deleted_by: adminUser.id,
          },
        );

        //Soft Delete User
        await manager.getRepository<UserEntity>('admin_users').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find Admin User Data
      const expectedData = await this.userRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Data Found!');
      }

      //Delete data
      await this.userRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
