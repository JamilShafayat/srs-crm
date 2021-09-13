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

  /*
    fetch all employees
    return an array of objects
  */
  @Get()
  @ApiResponse({ description: 'Get all employees', status: HttpStatus.OK })
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
      message: 'All employee fetched Successfully',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { employees },
    });
  }

  /*
    create new employee
    return single object
  */
  @Post()
  @ApiResponse({
    description: 'Create new employee',
    status: HttpStatus.CREATED,
  })
  @ApiBody({ type: CreateEmployeeDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe())
    createEmployeeDto: CreateEmployeeDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @TransactionManager() manager: EntityManager,
  ) {
    const employee = await this.employeeService.create(createEmployeeDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.CREATED,
      message: 'Employee created successfully',
      data: { employee },
    });
  }

  /*
    fetch all active employees
    return an array of objects
  */
  @Get('/list')
  @ApiResponse({
    description: 'Get only active employees',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [employees] = await this.employeeService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All active employee fetched successfully',
      data: { employees },
    });
  }

  /*
    fetch single employee
    return single object
  */
  @Get(':id')
  @ApiResponse({
    description: 'Single employee fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: EmployeeIdParamDto) {
    const employee = await this.employeeService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single employee fetched successfully',
      data: { employee },
    });
  }

  /*
    update single employee
    return single object
  */
  @Put(':id')
  @ApiResponse({
    description: 'Single employee updated',
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
      message: 'Employee updated successfully',
      data: { employee },
    });
  }

  /*
    update employee status
    return single object
  */
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single employee status changed',
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
      message: 'Employee status updated successfully',
      data: { employee },
    });
  }

  /*
    delete single employee - soft delete
    return null
  */
  @Delete(':id')
  @ApiResponse({
    description: 'Single employee deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: EmployeeIdParamDto,
  ) {
    await this.employeeService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee soft deleted',
      data: {},
    });
  }

  /*
    delete single employee - hard/permanent delete
    return null
  */
  @Delete('/:id/delete')
  @ApiResponse({
    description: 'Single employee deleted permanently',
    status: HttpStatus.OK,
  })
  async finalDelete(
    @Param(new DtoValidationPipe()) params: EmployeeIdParamDto,
  ) {
    await this.employeeService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Employee completely deleted',
      data: {},
    });
  }
}
