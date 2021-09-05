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
import { CreateDesignationDto } from '../dto/create-designation.dto';
import { DesignationIdParamDto } from '../dto/designation-id-param.dto';
import { DesignationListDto } from '../dto/designation-list.dto';
import { StatusChangeDesignationDto } from '../dto/status-change-designation.dto';
import { UpdateDesignationDto } from '../dto/update-designation-dto';
import { DesignationService } from '../services/designation.service';

@Controller('v1/admin/designations')
@ApiTags('Designation')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  // Fetch all designations
  @Get()
  @ApiResponse({ description: 'Get All Designations', status: HttpStatus.OK })
  async findAll(
    @Query() filter: DesignationListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [designations, total] = await this.designationService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Designation Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { designations },
    });
  }

  // Insert designation
  @Post()
  @ApiResponse({ description: 'Designation Add', status: HttpStatus.OK }) // swagger header for designation create request
  @ApiBody({ type: CreateDesignationDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe()) createDesignationDto: CreateDesignationDto,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    const designation = await this.designationService.create(
      createDesignationDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Designation Created Successfully',
      data: { designation },
    });
  }

  // Fetch only active designations
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active Designations',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [designations] = await this.designationService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Designations Fetched',
      data: { designations },
    });
  }

  // Fetch single designation
  @Get(':id')
  @ApiResponse({
    description: 'Single Designation Fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: DesignationIdParamDto) {
    const designation = await this.designationService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Designation Fetched',
      data: { designation },
    });
  }

  // Update designation
  @Put(':id')
  @ApiResponse({
    description: 'Single Designation Fetched',
    status: HttpStatus.OK,
  })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: DesignationIdParamDto,
    @Body(new DtoValidationPipe()) updateDesignationDto: UpdateDesignationDto,
  ) {
    const designation = await this.designationService.update(
      params.id,
      updateDesignationDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Designation Updated',
      data: { designation },
    });
  }

  // Update designation status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Designation Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: DesignationIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeDesignationDto: StatusChangeDesignationDto,
  ) {
    const designation = await this.designationService.status(
      params.id,
      statusChangeDesignationDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Designation Status Updated',
      data: { designation },
    });
  }

  // Soft delete single designation
  @Delete(':id')
  @ApiResponse({
    description: 'Single Designation Deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: DesignationIdParamDto,
  ) {
    await this.designationService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Designation Soft Deleted',
      data: {},
    });
  }

  // Hard delete single designation
  @Delete('/:id/delete')
  async finalDelete(
    @Param(new DtoValidationPipe()) params: DesignationIdParamDto,
  ) {
    await this.designationService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Designation Completely Deleted',
      data: {},
    });
  }
}
