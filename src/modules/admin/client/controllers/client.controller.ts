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
import { CustomException } from 'src/common/exceptions/customException';
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

  /*
    fetch all clients
    return an array of objects
  */
  @Get()
  @ApiResponse({ description: 'Get all clients', status: HttpStatus.OK })
  async findAll(
    @Query() filter: ClientFilterListDto,
    @Pagination() pagination: PaginationDto,
  ) {
    try {
      const [clients, total] = await this.clientService.findAll(
        filter,
        pagination,
      );

      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'All clients fetched successfully',
        metadata: {
          page: pagination.page,
          totalCount: total,
          limit: pagination.limit,
        },
        data: { clients },
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    create new client
    return single object
  */
  @Post()
  @ApiResponse({ description: 'Create new client', status: HttpStatus.CREATED })
  @ApiBody({ type: CreateClientDto })
  async create(
    @AdminUser() user: AdminUserDto,
    @Body(new DtoValidationPipe())
    createClientDto: CreateClientDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @TransactionManager() manager: EntityManager,
  ) {
    try {
      const client = await this.clientService.create(createClientDto, user);

      return new PayloadResponseDTO({
        statusCode: HttpStatus.CREATED,
        message: 'Client created successfully',
        data: { client },
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    fetch all active clients
    return an array of objects
  */
  @Get('/list')
  @ApiResponse({
    description: 'Get only active clients',
    status: HttpStatus.OK,
  })
  async findAllList() {
    try {
      const [clients] = await this.clientService.findAllList();
      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'All active clients fetched successfully',
        data: { clients },
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    fetch single client
    return single object
  */
  @Get(':id')
  @ApiResponse({ description: 'Single client fetched', status: HttpStatus.OK })
  async findOne(@Param(new DtoValidationPipe()) params: ClientIdParamDto) {
    try {
      const client = await this.clientService.findOne(params.id);
      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'Single client fetched successfully',
        data: { client },
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    update single client
    return single object
  */
  @Put(':id')
  @ApiResponse({ description: 'Single client updated', status: HttpStatus.OK })
  async update(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ClientIdParamDto,
    @Body(new DtoValidationPipe()) updateClientDto: UpdateClientDto,
  ) {
    try {
      const client = await this.clientService.update(
        params.id,
        updateClientDto,
        user,
      );
      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'Client updated successfully',
        data: { client },
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    update client status
    return single object
  */
  @Patch(':id/status')
  @ApiResponse({
    description: 'Single client status updated',
    status: HttpStatus.OK,
  })
  async status(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ClientIdParamDto,
    @Body(new DtoValidationPipe())
    statusChangeClientDto: StatusChangeClientDto,
  ) {
    try {
      const client = await this.clientService.status(
        params.id,
        statusChangeClientDto,
        user,
      );
      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'Client status updated successfully',
        data: { client },
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    delete single client - soft delete
    return null
  */
  @Delete(':id')
  @ApiResponse({ description: 'Single client deleted', status: HttpStatus.OK })
  async remove(
    @AdminUser() user: AdminUserDto,
    @Param(new DtoValidationPipe()) params: ClientIdParamDto,
  ) {
    try {
      await this.clientService.remove(params.id, user);
      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'Client soft deleted',
        data: {},
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /*
    delete single client - hard/permanent delete
    return null
  */
  @Delete('/:id/delete')
  @ApiResponse({
    description: 'Single client deleted permanently',
    status: HttpStatus.OK,
  })
  async finalDelete(@Param(new DtoValidationPipe()) params: ClientIdParamDto) {
    try {
      await this.clientService.finalDelete(params.id);
      return new PayloadResponseDTO({
        statusCode: HttpStatus.OK,
        message: 'Client completely deleted',
        data: {},
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
