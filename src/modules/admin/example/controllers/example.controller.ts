import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { EntityManager, TransactionManager } from 'typeorm';
import { AdminUser } from '../../../../common/decorators/Admin/admin-user.decorator';
import { Pagination } from '../../../../common/decorators/pagination.decorator';
import { AdminUserDto } from '../../../../common/dto/admin-user.dto';
import { PaginationDto } from '../../../../common/dto/Pagination.dto';
import { PayloadResponseDTO } from '../../../../common/dto/payload-response.dto';
import { DtoValidationPipe } from '../../../../common/pipes/dtoValidation.pipe';
import { GetItemsDTO } from '../dto/get-items.dto';
import { ItemStoreDTO } from '../dto/item-store.dto';
import { TagStoreDTO } from '../dto/tag-store.dto';
import { TagUpdateParamDto } from '../dto/tag-update-param.dto';
import { ExampleService } from '../services/example.service';

@Controller('v1/admin/example')
@ApiTags('Example')
//@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('/')
  async getItems(
    @AdminUser() adminUser: AdminUserDto,
    @Query() query: GetItemsDTO,
    @Pagination() pagination: PaginationDto,
  ) {
    await this.exampleService.findAll();
    console.log('Helloo.....');
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: '',
      metadata: {
        page: pagination.page,
        totalCount: 100,
        limit: pagination.limit,
      },
      data: { query, pagination, adminUser },
    });
  }

  @Post('/')
  @ApiResponse({ description: 'Example Item Create', status: HttpStatus.OK })
  @ApiUnauthorizedResponse({ description: 'Invalid Credential' })
  @ApiBody({ type: ItemStoreDTO })
  /*@UsePipes(new YupValidationPipe(exampleCreateFilter))*/
  async storeItem(
    @AdminUser() adminUser: AdminUserDto,
    @Body(new DtoValidationPipe()) ItemStoreData: ItemStoreDTO,
    @TransactionManager() manager: EntityManager, //if needed transaction use @TransactionManager
  ) {
    await this.exampleService.itemStore(ItemStoreData, manager);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: '',
      data: { adminUser },
    });
  }

  @Post('/:exampleId/:tagId')
  @ApiResponse({ description: 'Example Tag Updated', status: HttpStatus.OK })
  @ApiResponse({
    description: 'Validation Error',
    status: HttpStatus.BAD_REQUEST,
  })
  //@UsePipes(new YupValidationPipe(exampleTagUpdateFilterSchema))
  async tagUpdate(
    @Body(new DtoValidationPipe()) tagStoreData: TagStoreDTO,
    @Param(new DtoValidationPipe()) param: TagUpdateParamDto,
    @TransactionManager() manager: EntityManager,
  ) {
    //if needed transaction
    await this.exampleService.tagUpdate(tagStoreData, manager);
    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: '',
      data: {},
    });
  }
}
