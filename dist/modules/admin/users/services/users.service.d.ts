import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { UserEntity } from 'src/common/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { AdminUserListDto } from '../dto/admin-user-list.dto';
import { CreateAdminUserDto } from '../dto/create-user.dto';
import { StatusChangeAdminUserDto } from '../dto/status-change-user.dto';
import { UpdateAdminUserDto } from '../dto/update-user.dto';
export declare class AdminUsersService {
    private readonly userRepository;
    private connection;
    constructor(userRepository: Repository<UserEntity>, connection: Connection);
    findAll(filter: AdminUserListDto, pagination: PaginationDto): Promise<[UserEntity[], number]>;
    create(createAdminUserDto: CreateAdminUserDto, adminUser: AdminUserDto): Promise<{
        name: string;
        phone: string;
        user_type: string;
        password: any;
        created_by: string;
    } & UserEntity>;
    findAllList(): Promise<[UserEntity[], number]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateAdminUserDto: UpdateAdminUserDto, adminUser: AdminUserDto): Promise<UserEntity>;
    status(id: string, statusChangeAdminUserDto: StatusChangeAdminUserDto, adminUser: AdminUserDto): Promise<UserEntity>;
    remove(id: string, adminUser: AdminUserDto): Promise<void>;
    finalDelete(id: string): Promise<boolean>;
}
