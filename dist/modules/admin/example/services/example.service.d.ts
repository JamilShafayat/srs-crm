import { EntityManager } from 'typeorm';
import { FileUploadService } from '../../../../common/services/file-upload.service';
import { ItemStoreDTO } from '../dto/item-store.dto';
import { TagStoreDTO } from '../dto/tag-store.dto';
export declare class ExampleService {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    findAll(): Promise<number>;
    itemStore(itemStoreData: ItemStoreDTO, manager: EntityManager): Promise<void>;
    tagsStore(tagItems: TagStoreDTO[], manager: EntityManager): Promise<void>;
    tagStore(tagData: TagStoreDTO, manager: EntityManager): Promise<void>;
    tagUpdate(tagData: TagStoreDTO, manager: EntityManager): Promise<void>;
}
