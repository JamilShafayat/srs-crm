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
import { CreateTeamDto } from '../dto/create-team.dto';
import { StatusChangeTeamDto } from '../dto/status-change-team.dto';
import { TeamIdParamDto } from '../dto/team-id-param.dto';
import { TeamListDto } from '../dto/team-list.dto';
import { UpdateTeamDto } from '../dto/update-team-dto';
import { TeamService } from '../services/team.service';

@Controller('v1/admin/teams')
@ApiTags('Team')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // Fetch all teams
  @Get()
  @ApiResponse({ description: 'Get All Teams', status: HttpStatus.OK })
  async findAll(
    @Query() filter: TeamListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [teams, total] = await this.teamService.findAll(filter, pagination);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Team Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { teams },
    });
  }

  // Insert team
  @Post()
  @ApiResponse({ description: 'Team Add', status: HttpStatus.OK })
  @ApiBody({ type: CreateTeamDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe()) createTeamDto: CreateTeamDto,
    @TransactionManager() manager: EntityManager,
  ) {
    const team = await this.teamService.create(createTeamDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Created Successfully',
      data: { team },
    });
  }

  // Fetch only active teams
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active Teams',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [teams] = await this.teamService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Team Fetched',
      data: { teams },
    });
  }

  // Fetch single team
  @Get(':id')
  @ApiResponse({
    description: 'Single Team Fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: TeamIdParamDto) {
    const team = await this.teamService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Team Fetched',
      data: { team },
    });
  }

  // Update team
  @Put(':id')
  @ApiResponse({
    description: 'Single Team Fetched',
    status: HttpStatus.OK,
  })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamIdParamDto,
    @Body(new DtoValidationPipe()) updateTeamDto: UpdateTeamDto,
  ) {
    const team = await this.teamService.update(params.id, updateTeamDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Updated Successfully',
      data: { team },
    });
  }

  // Update team status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Team Status Updated',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeTeamDto: StatusChangeTeamDto,
  ) {
    const team = await this.teamService.status(
      params.id,
      statusChangeTeamDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Status Updated Successfully',
      data: { team },
    });
  }

  // Soft delete single team
  @Delete(':id')
  @ApiResponse({
    description: 'Single Team Deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamIdParamDto,
  ) {
    await this.teamService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Soft Deleted',
      data: {},
    });
  }

  // Hard delete single team
  @Delete('/:id/delete')
  async finalDelete(@Param(new DtoValidationPipe()) params: TeamIdParamDto) {
    await this.teamService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team Completely Deleted',
      data: {},
    });
  }
}
