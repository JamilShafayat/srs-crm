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
import { ClientFilterListDto } from '../dto/client-filter-list.dto';
import { ClientIdParamDto } from '../dto/client-id-param.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { StatusChangeClientDto } from '../dto/status-change-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientService } from '../services/client.service';

@Controller('v1/admin/clients')
@ApiTags('Client')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'Invalid Credential' })
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // Fetch all clients
  @Get()
  @ApiResponse({ description: 'Get All Clients', status: HttpStatus.OK })
  async findAll(
    @Query() filter: ClientFilterListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    const [clients, total] = await this.clientService.findAll(
      filter,
      pagination,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Clients Fetched',
      metadata: {
        page: pagination.page,
        totalCount: total,
        limit: pagination.limit,
      },
      data: { clients },
    });
  }

  // Insert client data
  @Post()
  @ApiResponse({ description: 'Client Create', status: HttpStatus.OK })
  @ApiBody({ type: CreateClientDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe())
    createClientDto: CreateClientDto,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    const client = await this.clientService.create(createClientDto, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Client Entry Successful',
      data: { client },
    });
  }

  // Fetch only active clients
  @Get('/list')
  @ApiResponse({
    description: 'Get Only Active clients',
    status: HttpStatus.OK,
  })
  async findAllList() {
    const [clients] = await this.clientService.findAllList();
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'All Active Client Fetched',
      data: { clients },
    });
  }

  // Fetch single client
  @Get(':id')
  @ApiResponse({ description: 'Single Client Fetched', status: HttpStatus.OK })
  async findOne(@Param(new DtoValidationPipe()) params: ClientIdParamDto) {
    const client = await this.clientService.findOne(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Single Client Fetched',
      data: { client },
    });
  }

  // Update client data
  @Put(':id')
  @ApiResponse({ description: 'Single Client Updated', status: HttpStatus.OK })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ClientIdParamDto,
    @Body(new DtoValidationPipe()) updateClientDto: UpdateClientDto,
  ) {
    const client = await this.clientService.update(
      params.id,
      updateClientDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Client Updated Successfully',
      data: { client },
    });
  }

  // Update client status
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single Client Status Changed',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ClientIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeClientDto: StatusChangeClientDto,
  ) {
    const client = await this.clientService.status(
      params.id,
      statusChangeClientDto,
      user,
    );
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Client Updated',
      data: { client },
    });
  }

  // Soft delete single client
  @Delete(':id')
  @ApiResponse({ description: 'Single Client Deleted', status: HttpStatus.OK })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ClientIdParamDto,
  ) {
    await this.clientService.remove(params.id, user);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Client Soft Deleted',
      data: {},
    });
  }

  // Hard delete single client
  @Delete('/:id/delete')
  async finalDelete(@Param(new DtoValidationPipe()) params: ClientIdParamDto) {
    await this.clientService.finalDelete(params.id);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Client Completely Deleted',
      data: {},
    });
  }
}
