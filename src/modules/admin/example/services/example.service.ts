import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { FileUploadService } from '../../../../common/services/file-upload.service';
import { ItemStoreDTO } from '../dto/item-store.dto';
import { TagStoreDTO } from '../dto/tag-store.dto';

@Injectable()
export class ExampleService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async findAll() {
    const isExists = this.fileUploadService.IsExistsTempFile(
      '92-1621609057093-563162133.png',
    );
    this.fileUploadService.moveTempFile('92-1621609057093-563162133.png');
    return 10;
  }
  async itemStore(itemStoreData: ItemStoreDTO, manager: EntityManager) {
    await this.tagsStore(itemStoreData.tags, manager);
  }

  async tagsStore(tagItems: TagStoreDTO[], manager: EntityManager) {
    for (const tag of tagItems) {
      await this.tagStore(tag, manager);
    }
  }

  async tagStore(tagData: TagStoreDTO, manager: EntityManager) {}
  async tagUpdate(tagData: TagStoreDTO, manager: EntityManager) {}
}
