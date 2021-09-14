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

  /*
    fetch all teams
    return an array of objects
  */
  @Get()
  @ApiResponse({ description: 'Get all teams', status: HttpStatus.OK })
  async findAll(
    @Query() filter: TeamListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [teams, total] = await this.teamService.findAll(filter, pagination);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All teams fetched successfully',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { teams },
    });
  }

  /*
    create new team
    return single object
  */
  @Post()
  @ApiResponse({ description: 'Create new team', status: HttpStatus.OK })
  @ApiBody({ type: CreateTeamDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe()) createTeamDto: CreateTeamDto,
    @TransactionManager() manager: EntityManager,
  ) {
    const team = await this.teamService.create(createTeamDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team created successfully',
      data: { team },
    });
  }

  /*
    fetch all active teams
    return an array of objects
  */
  @Get('/list')
  @ApiResponse({
    description: 'Get only active teams',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [teams] = await this.teamService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All active teams fetched successfully',
      data: { teams },
    });
  }

  /*
    fetch single team
    return single object
  */
  @Get(':id')
  @ApiResponse({
    description: 'Single team fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: TeamIdParamDto) {
    const team = await this.teamService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single team fetched successfully',
      data: { team },
    });
  }

  /*
    update single team
    return single object
  */
  @Put(':id')
  @ApiResponse({
    description: 'Single team updated',
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
      message: 'Team updated successfully',
      data: { team },
    });
  }

  /*
    update team status
    return single object
  */
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single team status updated',
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
      message: 'Team status updated successfully',
      data: { team },
    });
  }

  /*
    delete single team - soft delete
    return null
  */
  @Delete(':id')
  @ApiResponse({
    description: 'Single team deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TeamIdParamDto,
  ) {
    await this.teamService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team soft deleted',
      data: {},
    });
  }

  /*
    delete single team - hard/permanent delete
    return null
  */
  @Delete('/:id/delete')
  async finalDelete(@Param(new DtoValidationPipe()) params: TeamIdParamDto) {
    await this.teamService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Team completely deleted',
      data: {},
    });
  }
}
