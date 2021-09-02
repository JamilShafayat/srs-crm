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
import { CreateTestDto } from '../dto/create-test.dto';
import { StatusChangeTestDto } from '../dto/status-change-test.dto';
import { TestIdParamDto } from '../dto/test-id-param.dto';
import { TestListDto } from '../dto/test-list.dto';
import { UpdateTestDto } from '../dto/update-test-dto';
import { TestsService } from '../services/test.service';

@Controller('v1/admin/tests')
@ApiTags('Tests')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class TestsController {
  constructor(private readonly testService: TestsService) {}

  // Fetch All tests
  @Get()
  @ApiResponse({ description: 'Get All Tets', status: HttpStatus.OK })
  async findAll(
    @Query() filter: TestListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [tests, total] = await this.testService.findAll(filter, pagination);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All tests Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { tests },
    });
  }

  // Insert Data
  @Post()
  @ApiResponse({ description: 'Test Add', status: HttpStatus.OK }) // swagger header for test create request
  @ApiBody({ type: CreateTestDto })
  async create(
    @AdminUser() adminUser: AdminUserDto,
    @Body(new DtoValidationPipe()) createTestDto: CreateTestDto,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    const test = await this.testService.create(createTestDto, adminUser);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Test Entry Successful',
      data: { test },
    });
  }

  // Fetch Only Active Data
  @Get('/list')
  @ApiResponse({ description: 'Get Only Active Tests', status: HttpStatus.OK })
  async findAllList() {
    const [tests] = await this.testService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Tests Fetched',
      data: { tests },
    });
  }

  // Fetch Single Data
  @Get(':id')
  @ApiResponse({ description: 'Single Test Fetched', status: HttpStatus.OK })
  async findOne(@Param(new DtoValidationPipe()) params: TestIdParamDto) {
    const test = await this.testService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Test Fetched',
      data: { test },
    });
  }

  // Update Data
  @Put(':id')
  @ApiResponse({ description: 'Single Test Fetched', status: HttpStatus.OK })
  async update(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TestIdParamDto,
    @Body(new DtoValidationPipe()) updateTestDto: UpdateTestDto,
  ) {
    const test = await this.testService.update(
      params.id,
      updateTestDto,
      adminUser,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Data Updated',
      data: { test },
    });
  }

  // Update test status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Test Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TestIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeTestDto: StatusChangeTestDto,
  ) {
    const test = await this.testService.status(
      params.id,
      statusChangeTestDto,
      adminUser,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'test Updated',
      data: { test },
    });
  }

  // Soft Delete Single test
  @Delete(':id')
  @ApiResponse({ description: 'Single Test Deleted', status: HttpStatus.OK })
  async remove(
    @AdminUser() adminUser: AdminUserDto,
    @Param(new DtoValidationPipe()) params: TestIdParamDto,
  ) {
    await this.testService.remove(params.id, adminUser);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Data Soft Deleted',
      data: {},
    });
  }

  // Hard Delete Single user
  @Delete('/:id/delete')
  async finalDelete(@Param(new DtoValidationPipe()) params: TestIdParamDto) {
    await this.testService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Data Completely Deleted',
      data: {},
    });
  }
}
