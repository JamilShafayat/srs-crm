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
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectFilterListDto } from '../dto/project-filter-list.dto';
import { ProjectIdParamDto } from '../dto/project-id-param.dto';
import { StatusChangeProjectDto } from '../dto/status-change-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectService } from '../services/project.service';

@Controller('v1/admin/projects')
@ApiTags('Project')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Fetch all project
  @Get()
  @ApiResponse({ description: 'Get All Projects', status: HttpStatus.OK })
  async findAll(
    @Query() filter: ProjectFilterListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [projects, total] = await this.projectService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Project Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { projects },
    });
  }

  // Insert project data
  @Post()
  @ApiResponse({ description: 'Project Create', status: HttpStatus.OK })
  @ApiBody({ type: CreateProjectDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe())
    createProjectDto: CreateProjectDto,
    @TransactionManager() manager: EntityManager,
  ) {
    const project = await this.projectService.create(createProjectDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Project Created Successfully',
      data: { project },
    });
  }

  // Fetch only active project
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active Project',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [projects] = await this.projectService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Project Fetched',
      data: { projects },
    });
  }

  // Fetch single project
  @Get(':id')
  @ApiResponse({
    description: 'Single Project Fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: ProjectIdParamDto) {
    const project = await this.projectService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Project Fetched',
      data: { project },
    });
  }

  // Update project data
  @Put(':id')
  @ApiResponse({
    description: 'Single Project Updated',
    status: HttpStatus.OK,
  })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ProjectIdParamDto,
    @Body(new DtoValidationPipe()) updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectService.update(
      params.id,
      updateProjectDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Project Updated Successfully',
      data: { project },
    });
  }

  // Update project status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Project Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ProjectIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeProjectDto: StatusChangeProjectDto,
  ) {
    const project = await this.projectService.status(
      params.id,
      statusChangeProjectDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Project Status Updated Successfully',
      data: { project },
    });
  }

  // Soft delete single project
  @Delete(':id')
  @ApiResponse({
    description: 'Single Project Deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ProjectIdParamDto,
  ) {
    await this.projectService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Project Soft Deleted',
      data: {},
    });
  }

  // Hard delete single project
  @Delete('/:id/delete')
  async finalDelete(@Param(new DtoValidationPipe()) params: ProjectIdParamDto) {
    await this.projectService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Project Completely Deleted',
      data: {},
    });
  }
}
