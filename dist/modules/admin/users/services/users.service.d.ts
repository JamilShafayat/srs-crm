import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { UserEntity } from 'src/common/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { StatusChangeUserDto } from '../dto/status-change-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterListDto } from '../dto/user-filter-list.dto';
export declare class UsersService {
    private readonly userRepository;
    private connection;
    constructor(userRepository: Repository<UserEntity>, connection: Connection);
    findAll(filter: UserFilterListDto, pagination: PaginationDto): Promise<[UserEntity[], number]>;
    create(createUserDto: CreateUserDto, adminUser: AdminUserDto): Promise<{
        name: string;
        phone: string;
        user_type: string;
        password: any;
        created_by: string;
    } & UserEntity>;
    findAllList(): Promise<[UserEntity[], number]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto, adminUser: AdminUserDto): Promise<UserEntity>;
    status(id: string, statusChangeUserDto: StatusChangeUserDto, adminUser: AdminUserDto): Promise<UserEntity>;
    remove(id: string, adminUser: AdminUserDto): Promise<void>;
    finalDelete(id: string): Promise<boolean>;
}
