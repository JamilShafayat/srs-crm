import { ItemStoreDTO } from '../dto/item-store.dto';
import { ExampleService } from '../services/example.service';
import { PayloadResponseDTO } from '../../../../common/dto/payload-response.dto';
import { EntityManager } from 'typeorm';
import { TagStoreDTO } from '../dto/tag-store.dto';
import { TagUpdateParamDto } from '../dto/tag-update-param.dto';
import { AdminUserDto } from '../../../../common/dto/admin-user.dto';
import { GetItemsDTO } from '../dto/get-items.dto';
import { PaginationDto } from '../../../../common/dto/Pagination.dto';
export declare class ExampleController {
    private readonly exampleService;
    constructor(exampleService: ExampleService);
    getItems(adminUser: AdminUserDto, query: GetItemsDTO, pagination: PaginationDto): Promise<PayloadResponseDTO>;
    storeItem(adminUser: AdminUserDto, ItemStoreData: ItemStoreDTO, manager: EntityManager): Promise<PayloadResponseDTO>;
    tagUpdate(tagStoreData: TagStoreDTO, param: TagUpdateParamDto, manager: EntityManager): Promise<PayloadResponseDTO>;
}
