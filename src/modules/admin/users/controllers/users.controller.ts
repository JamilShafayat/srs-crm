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
import { CreateUserDto } from '../dto/create-user.dto';
import { StatusChangeUserDto } from '../dto/status-change-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterListDto } from '../dto/user-filter-list.dto';
import { UserIdParamDto } from '../dto/user-id-param.dto';
import { UsersService } from '../services/users.service';

@Controller('v1/admin/users')
@ApiTags('Admin Users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Fetch All users
  @Get()
  @ApiResponse({ description: 'Get All Users', status: HttpStatus.OK })
  async findAll(
    @Query() filter: UserFilterListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [users, total] = await this.usersService.findAll(filter, pagination);
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
  @ApiResponse({ description: 'User Create', status: HttpStatus.OK })
  @ApiBody({ type: CreateUserDto })
  async create(
    @AdminUser() adminUser: AdminUserDto,
    @Body(new DtoValidationPipe()) createUserDto: CreateUserDto,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    console.log(createUserDto);
    const user = await this.usersService.create(createUserDto, adminUser);
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
    const [user] = await this.usersService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active user Fetched',
      data: { user },
    });
  }

  // Fetch Single Data
  @Get(':id')
  @ApiResponse({ description: 'Single User Fetched', status: HttpStatus.OK })
  async findOne(@Param(new DtoValidationPipe()) params: UserIdParamDto) {
    const user = await this.usersService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single user Fetched',
      data: { user },
    });
  }

  // Update Data
  @Put(':id')
  @ApiResponse({ description: 'Single User Updated', status: HttpStatus.OK })
  async update(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: UserIdParamDto,
    @Body(new DtoValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(
      params.id,
      updateUserDto,
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
    @Param(new DtoValidationPipe()) params: UserIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeUserDto: StatusChangeUserDto,
  ) {
    const user = await this.usersService.status(
      params.id,
      statusChangeUserDto,
      adminUser,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'User Updated',
      data: { user },
    });
  }

  // Soft Delete Single user
  @Delete(':id')
  @ApiResponse({ description: 'Single User Deleted', status: HttpStatus.OK })
  async remove(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: UserIdParamDto,
  ) {
    await this.usersService.remove(params.id, adminUser);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'User Soft Deleted',
      data: {},
    });
  }

  // Hard Delete Single user
  @Delete('/:id/delete')
  async finalDelete(@Param(new DtoValidationPipe()) params: UserIdParamDto) {
    await this.usersService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'User Completely Deleted',
      data: {},
    });
  }
}
