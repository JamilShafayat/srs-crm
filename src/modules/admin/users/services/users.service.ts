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
	) { }

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

			const users = await this.userRepository.find({
				where: {
					...whereCondition,
				},
				order: { created_by: 'DESC' },
				skip: pagination.skip,
				take: pagination.limit,
				relations: ['comments'],
			});

			const total = await this.userRepository.count({
				where: { ...whereCondition },
			});

			return [users, total];
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async create(createUserDto: CreateUserDto, adminUser: AdminUserDto) {
		try {
			const { name, phone, password, user_type } = createUserDto;

			// find existing user
			const findUser = await this.userRepository.findOne({ phone });

			if (findUser) {
				throw new ValidationException([
					{
						field: 'phone',
						message: 'User Already Exists.',
					},
				]);
			}

			const hashedPassword = await bcrypt.hash(password, 12);
			const data = {
				name,
				phone,
				user_type,
				password: hashedPassword,
				created_by: adminUser.id,
			};

			const user = await this.userRepository.save(data);

			return user;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findAllList() {
		try {
			// find all active users
			const users = await this.userRepository.findAndCount({
				status: 1,
			});

			return users;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findOne(id: string): Promise<UserEntity> {
		try {
			// find single user
			const user = await this.userRepository.findOne({
				where: { id },
			});

			if (!user) {
				throw new NotFoundException('No user found on this id!');
			}
			return user;
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
			// find user
			const whereCondition = {};
			whereCondition['phone'] = Equal(updateUserDto.phone);
			whereCondition['id'] = Not(Equal(id));

			const checkPhoneNumber = await this.userRepository.findOne({
				where: { ...whereCondition },
			});

			if (checkPhoneNumber) {
				throw new ValidationException([
					{
						field: 'phone',
						message: 'Phone number already exists with another User.',
					},
				]);
			}

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

			const user = await this.userRepository.findOne(id);

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
			// find user
			const findUser = await this.userRepository.findOne(id);

			if (!findUser) {
				throw new NotFoundException('No user found on this id!');
			}

			await this.userRepository.update(
				{
					id: id,
				},
				{
					status: statusChangeUserDto.status,
					updated_by: adminUser.id,
				},
			);

			const user = await this.userRepository.findOne(id);

			return user;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async remove(id: string, adminUser: AdminUserDto) {
		try {
			// find User
			const user = await this.userRepository.findOne({ id: id });

			if (!user) {
				throw new NotFoundException('No User Found!');
			}

			await this.connection.transaction(async (manager) => {
				await manager.getRepository<UserEntity>('admin_users').update(
					{
						id: id,
					},
					{
						deleted_by: adminUser.id,
					},
				);

				await manager.getRepository<UserEntity>('admin_users').softDelete(id);
				return true;
			});
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async finalDelete(id: string) {
		try {
			// find user
			const user = await this.userRepository.find({
				where: { id },
				withDeleted: true,
			});

			if (!user) {
				throw new NotFoundException('No user found on this id!');
			}

			await this.userRepository.delete(id);

			return true;
		} catch (error) {
			throw new CustomException(error);
		}
	}
}
