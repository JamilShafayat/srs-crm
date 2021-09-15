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
import { ComplaintFilterListDto } from '../dto/complaint-filter-list.dto';
import { ComplaintIdParamDto } from '../dto/complaint-id-param.dto';
import { CreateComplaintDto } from '../dto/create-complaint.dto';
import { StatusChangeComplaintDto } from '../dto/status-change-complaint.dto';
import { UpdateComplaintDto } from '../dto/update-complaint.dto';
import { ComplaintService } from '../services/complaint.service';

@Controller('v1/admin/complaints')
@ApiTags('Complaint')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  // Fetch all complaint
  @Get()
  @ApiResponse({ description: 'Get All Complaints', status: HttpStatus.OK })
  async findAll(
    @Query() filter: ComplaintFilterListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [complaints, total] = await this.complaintService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Complaint Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { complaints },
    });
  }

  // Insert complaint data
  @Post()
  @ApiResponse({ description: 'Complaint Create', status: HttpStatus.OK })
  @ApiBody({ type: CreateComplaintDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe())
    createComplaintDto: CreateComplaintDto,
    @TransactionManager() manager: EntityManager,
  ) {
    const complaint = await this.complaintService.create(
      createComplaintDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.CREATED,
      message: 'Complaint Created Successfully',
      data: { complaint },
    });
  }

  // Fetch only active complaint
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active complaint',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [complaints] = await this.complaintService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active complaint Fetched',
      data: { complaints },
    });
  }

  // Fetch single complaint
  @Get(':id')
  @ApiResponse({
    description: 'Single complaint Fetched',
    status: HttpStatus.OK,
  })
  async findOne(@Param(new DtoValidationPipe()) params: ComplaintIdParamDto) {
    const complaint = await this.complaintService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Complaint Fetched',
      data: { complaint },
    });
  }

  // Update complaint data
  @Put(':id')
  @ApiResponse({
    description: 'Single Complaint Updated',
    status: HttpStatus.OK,
  })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ComplaintIdParamDto,
    @Body(new DtoValidationPipe()) updateComplaintDto: UpdateComplaintDto,
  ) {
    const complaint = await this.complaintService.update(
      params.id,
      updateComplaintDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Complaint Updated Successfully',
      data: { complaint },
    });
  }

  // Update complaint status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Complaint Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ComplaintIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeComplaintDto: StatusChangeComplaintDto,
  ) {
    const complaint = await this.complaintService.status(
      params.id,
      statusChangeComplaintDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Complaint Status Updated Successfully',
      data: { complaint },
    });
  }

  // Soft delete single complaint
  @Delete(':id')
  @ApiResponse({
    description: 'Single Complaint Deleted',
    status: HttpStatus.OK,
  })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ComplaintIdParamDto,
  ) {
    await this.complaintService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Complaint Soft Deleted',
      data: {},
    });
  }

  // Hard delete single complaint
  @Delete('/:id/delete')
  async finalDelete(
    @Param(new DtoValidationPipe()) params: ComplaintIdParamDto,
  ) {
    await this.complaintService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Complaint Completely Deleted',
      data: {},
    });
  }
}
