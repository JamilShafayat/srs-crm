import { CreateAdminUserDto } from '../dto/create-user.dto';
import { UpdateAdminUserDto } from '../dto/update-user.dto';
import { AdminUsersService } from '../services/users.service';
import { AdminUserListDto } from '../dto/admin-user-list.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { AdminUserIdParamDto } from '../dto/admin-user-id-param.dto';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { EntityManager } from 'typeorm';
import { StatusChangeAdminUserDto } from '../dto/status-change-user.dto';
export declare class UsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    findAll(filter: AdminUserListDto, pagination: PaginationDto): Promise<PayloadResponseDTO>;
    create(adminUser: AdminUserDto, createAdminUserDto: CreateAdminUserDto, manager: EntityManager): Promise<PayloadResponseDTO>;
    findAllList(): Promise<PayloadResponseDTO>;
    findOne(params: AdminUserIdParamDto): Promise<PayloadResponseDTO>;
    update(adminUser: AdminUserDto, params: AdminUserIdParamDto, updateAdminUserDto: UpdateAdminUserDto): Promise<PayloadResponseDTO>;
    status(adminUser: AdminUserDto, params: AdminUserIdParamDto, statusChangeAdminUserDto: StatusChangeAdminUserDto): Promise<PayloadResponseDTO>;
    remove(adminUser: AdminUserDto, params: AdminUserIdParamDto): Promise<PayloadResponseDTO>;
    finalDelete(params: AdminUserIdParamDto): Promise<PayloadResponseDTO>;
}
