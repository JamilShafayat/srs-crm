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
import { CreateTeamEmployeeDto } from '../dto/create-team-employee.dto';
import { StatusChangeTeamEmployeeDto } from '../dto/status-change-team-employee.dto';
import { TeamEmployeeIdParamDto } from '../dto/team-employee-id-param.dto';
import { TeamEmployeeListDto } from '../dto/team-employee-list.dto';
import { UpdateTeamEmployeeDto } from '../dto/update-team-employee.dto';
import { TeamEmployeeService } from '../services/team-employee.service';

@Controller('v1/admin/team_employees')
@ApiTags('Team Employee')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class TeamEmployeeController {
  constructor(private readonly teamEmployeeService: TeamEmployeeService) {}

  // Fetch all team-employees
  @Get()
  @ApiResponse({ description: 'Get All Team Employees', status: HttpStatus.OK })
  async findAll(
    @Query() filter: TeamEmployeeListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [teamEmployees, total] = await this.teamEmployeeService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Team Employee Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { teamEmployees },
    });
  }

  // Insert team employee
  @Post()
  @ApiResponse({ description: 'Team Employee Add', status: HttpStatus.OK })
  @ApiBody({ type: CreateTeamEmployeeDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe()) createTeamEmployeeDto: CreateTeamEmployeeDto,
    @TransactionManager() manager: EntityManager,
  ) {
    const teamEmployee = await this.teamEmployeeService.create(
      createTeamEmployeeDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Employee Created Successfully',
      data: { teamEmployee },
    });
  }

  // Fetch only active team-employees
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active Team Employees',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [teamEmployees] = await this.teamEmployeeService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Team Employee Fetched',
      data: { teamEmployees },
    });
  }

  // Fetch single team employee
  @Get(':id')
  @ApiResponse({
    description: 'Single Team Fetched',
    status: HttpStatus.OK,
  })
  async findOne(
    @Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
  ) {
    const teamEmployee = await this.teamEmployeeService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Team Employee Fetched',
      data: { teamEmployee },
    });
  }

  // Update team employee
  @Put(':id')
  @ApiResponse({
    description: 'Single Team Employee Fetched',
    status: HttpStatus.OK,
  })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
    @Body(new DtoValidationPipe()) updateTeamEmployeeDto: UpdateTeamEmployeeDto,
  ) {
    const team = await this.teamEmployeeService.update(
      params.id,
      updateTeamEmployeeDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Updated Successfully',
      data: { team },
    });
  }

  // Update team-employee status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Team Status Updated',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeTeamEmployeeDto: StatusChangeTeamEmployeeDto,
  ) {
    const teamEmployee = await this.teamEmployeeService.status(
      params.id,
      statusChangeTeamEmployeeDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Employee Status Updated Successfully',
      data: { teamEmployee },
    });
  }

  // Soft delete single team-employee
  @Delete(':id')
  @ApiResponse({
    description: 'Single Team Employee Deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
  ) {
    await this.teamEmployeeService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Employee Soft Deleted',
      data: {},
    });
  }

  // Hard delete single team-employee
  @Delete('/:id/delete')
  async finalDelete(
    @Param(new DtoValidationPipe()) params: TeamEmployeeIdParamDto,
  ) {
    await this.teamEmployeeService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Employee Completely Deleted',
      data: {},
    });
  }
}
