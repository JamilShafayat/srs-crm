import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminUser } from 'src/common/decorators/Admin/admin-user.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { AuthGuard } from 'src/common/guard/admin/auth.guard';
import { DtoValidationPipe } from 'src/common/pipes/dtoValidation.pipe';
import { EntityManager, TransactionManager } from 'typeorm';
import { AdminUserIdParamDto } from '../dto/admin-user-id-param.dto';
import { AdminUserListDto } from '../dto/admin-user-list.dto';
import { CreateAdminUserDto } from '../dto/create-user.dto';
import { StatusChangeAdminUserDto } from '../dto/status-change-user.dto';
import { UpdateAdminUserDto } from '../dto/update-user.dto';
import { AdminUsersService } from '../services/users.service';

@Controller('v1/admin/users')
@ApiTags('Admin Users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class UsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  // Fetch All users
  @Get()
  @ApiResponse({ description: 'Get All Users', status: HttpStatus.OK })
  async findAll(
    @Query() filter: AdminUserListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [users, total] = await this.adminUsersService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All users Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { users },
    });
  }

  // Insert Data
  @Post()
  @ApiResponse({ description: 'Admin User Add', status: HttpStatus.OK })
  @ApiBody({ type: CreateAdminUserDto })
  async create(
    @AdminUser() adminUser: AdminUserDto,
    @Body(new DtoValidationPipe()) createAdminUserDto: CreateAdminUserDto,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    console.log(createAdminUserDto);
    const user = await this.adminUsersService.create(
      createAdminUserDto,
      adminUser,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'User Entry Successful',
      data: { user },
    });
  }

  // Fetch Only Active Data
  @Get('/list')
  @ApiResponse({ description: 'Get Only Active Users', status: HttpStatus.OK })
  async findAllList() {
    const [user] = await this.adminUsersService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active user Fetched',
      data: { user },
    });
  }

  // Fetch Single Data
  @Get(':id')
  @ApiResponse({ description: 'Single User Fetched', status: HttpStatus.OK })
  async findOne(@Param(new DtoValidationPipe()) params: AdminUserIdParamDto) {
    const user = await this.adminUsersService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single user Fetched',
      data: { user },
    });
  }

  // Update Data
  @Put(':id')
  @ApiResponse({ description: 'Single User Fetched', status: HttpStatus.OK })
  async update(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: AdminUserIdParamDto,
    @Body(new DtoValidationPipe()) updateAdminUserDto: UpdateAdminUserDto,
  ) {
    const user = await this.adminUsersService.update(
      params.id,
      updateAdminUserDto,
      adminUser,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Data Updated',
      data: { user },
    });
  }

  // Update user Status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single User Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: AdminUserIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeAdminUserDto: StatusChangeAdminUserDto,
  ) {
    const user = await this.adminUsersService.status(
      params.id,
      statusChangeAdminUserDto,
      adminUser,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'user Updated',
      data: { user },
    });
  }

  // Soft Delete Single user
  @Delete(':id')
  @ApiResponse({ description: 'Single User Deleted', status: HttpStatus.OK })
  async remove(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: AdminUserIdParamDto,
  ) {
    await this.adminUsersService.remove(params.id, adminUser);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Data Soft Deleted',
      data: {},
    });
  }

  // Hard Delete Single user
  @Delete('/:id/delete')
  async finalDelete(
    @Param(new DtoValidationPipe()) params: AdminUserIdParamDto,
  ) {
    await this.adminUsersService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Data Completely Deleted',
      data: {},
    });
  }
}
