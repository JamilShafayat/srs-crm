import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { StatusChangeUserDto } from '../dto/status-change-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterListDto } from '../dto/user-filter-list.dto';
import { UserIdParamDto } from '../dto/user-id-param.dto';
import { UsersService } from '../services/users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(filter: UserFilterListDto, pagination: PaginationDto): Promise<PayloadResponseDTO>;
    create(adminUser: AdminUserDto, createUserDto: CreateUserDto, manager: EntityManager): Promise<PayloadResponseDTO>;
    findAllList(): Promise<PayloadResponseDTO>;
    findOne(params: UserIdParamDto): Promise<PayloadResponseDTO>;
    update(adminUser: AdminUserDto, params: UserIdParamDto, updateUserDto: UpdateUserDto): Promise<PayloadResponseDTO>;
    status(adminUser: AdminUserDto, params: UserIdParamDto, statusChangeUserDto: StatusChangeUserDto): Promise<PayloadResponseDTO>;
    remove(adminUser: AdminUserDto, params: UserIdParamDto): Promise<PayloadResponseDTO>;
    finalDelete(params: UserIdParamDto): Promise<PayloadResponseDTO>;
}
