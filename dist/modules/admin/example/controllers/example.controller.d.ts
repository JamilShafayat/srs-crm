import { EntityManager } from 'typeorm';
import { AdminUserDto } from '../../../../common/dto/admin-user.dto';
import { PaginationDto } from '../../../../common/dto/Pagination.dto';
import { PayloadResponseDTO } from '../../../../common/dto/payload-response.dto';
import { GetItemsDTO } from '../dto/get-items.dto';
import { ItemStoreDTO } from '../dto/item-store.dto';
import { TagStoreDTO } from '../dto/tag-store.dto';
import { TagUpdateParamDto } from '../dto/tag-update-param.dto';
import { ExampleService } from '../services/example.service';
export declare class ExampleController {
    private readonly exampleService;
    constructor(exampleService: ExampleService);
    getItems(adminUser: AdminUserDto, query: GetItemsDTO, pagination: PaginationDto): Promise<PayloadResponseDTO>;
    storeItem(adminUser: AdminUserDto, ItemStoreData: ItemStoreDTO, manager: EntityManager): Promise<PayloadResponseDTO>;
    tagUpdate(tagStoreData: TagStoreDTO, param: TagUpdateParamDto, manager: EntityManager): Promise<PayloadResponseDTO>;
}
