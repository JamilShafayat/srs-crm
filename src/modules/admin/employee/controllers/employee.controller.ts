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
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeFilterListDto } from '../dto/employee-filter-list.dto';
import { EmployeeIdParamDto } from '../dto/employee-id-param.dto';
import { StatusChangeEmployeeDto } from '../dto/status-change-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { EmployeeService } from '../services/employee.service';

@Controller('v1/admin/employees')
@ApiTags('Employee')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Fetch all employee
  @Get()
  @ApiResponse({ description: 'Get All Employees', status: HttpStatus.OK })
  async findAll(
    @Query() filter: EmployeeFilterListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [employees, total] = await this.employeeService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Employee Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { employees },
    });
  }

  // Insert employee data
  @Post()
  @ApiResponse({ description: 'Employee Create', status: HttpStatus.OK })
  @ApiBody({ type: CreateEmployeeDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe())
    createEmployeeDto: CreateEmployeeDto,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    const employee = await this.employeeService.create(createEmployeeDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee Created Successfully',
      data: { employee },
    });
  }

  // Fetch only active employee
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active Employee',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [employees] = await this.employeeService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Employee Fetched',
      data: { employees },
    });
  }

  // Fetch single employee
  @Get(':id')
  @ApiResponse({
    description: 'Single Employee Fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: EmployeeIdParamDto) {
    const employee = await this.employeeService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Employee Fetched',
      data: { employee },
    });
  }

  // Update employee data
  @Put(':id')
  @ApiResponse({
    description: 'Single Employee Updated',
    status: HttpStatus.OK,
  })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: EmployeeIdParamDto,
    @Body(new DtoValidationPipe()) updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const employee = await this.employeeService.update(
      params.id,
      updateEmployeeDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee Updated Successfully',
      data: { employee },
    });
  }

  // Update employee status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Employee Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: EmployeeIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeEmployeeDto: StatusChangeEmployeeDto,
  ) {
    const employee = await this.employeeService.status(
      params.id,
      statusChangeEmployeeDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee Status Updated Successfully',
      data: { employee },
    });
  }

  // Soft delete single employee
  @Delete(':id')
  @ApiResponse({
    description: 'Single Employee Deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: EmployeeIdParamDto,
  ) {
    await this.employeeService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee Soft Deleted',
      data: {},
    });
  }

  // Hard delete single employee
  @Delete('/:id/delete')
  async finalDelete(
    @Param(new DtoValidationPipe()) params: EmployeeIdParamDto,
  ) {
    await this.employeeService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee Completely Deleted',
      data: {},
    });
  }
}
