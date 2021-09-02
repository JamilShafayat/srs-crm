import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { AdminUserEntity } from 'src/common/entities/admin/users/user.entity';
import { Connection, Repository } from 'typeorm';
import { AdminUserListDto } from '../dto/admin-user-list.dto';
import { CreateAdminUserDto } from '../dto/create-user.dto';
import { StatusChangeAdminUserDto } from '../dto/status-change-user.dto';
import { UpdateAdminUserDto } from '../dto/update-user.dto';
export declare class AdminUsersService {
    private readonly adminUserRepository;
    private connection;
    constructor(adminUserRepository: Repository<AdminUserEntity>, connection: Connection);
    findAll(filter: AdminUserListDto, pagination: PaginationDto): Promise<[AdminUserEntity[], number]>;
    create(createAdminUserDto: CreateAdminUserDto, adminUser: AdminUserDto): Promise<{
        full_name: string;
        phone: string;
        user_type: string;
        password: any;
        created_by: string;
    } & AdminUserEntity>;
    findAllList(): Promise<[AdminUserEntity[], number]>;
    findOne(id: string): Promise<AdminUserEntity>;
    update(id: string, updateAdminUserDto: UpdateAdminUserDto, adminUser: AdminUserDto): Promise<AdminUserEntity>;
    status(id: string, statusChangeAdminUserDto: StatusChangeAdminUserDto, adminUser: AdminUserDto): Promise<AdminUserEntity>;
    remove(id: string, adminUser: AdminUserDto): Promise<void>;
    finalDelete(id: string): Promise<boolean>;
}
