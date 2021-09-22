import { BaseEntity } from 'typeorm';
import BaseDTO from '../dto/base.dto';
import { PaginationDto } from '../dto/Pagination.dto';

/**
 * @description Base Service
 * @author xoss point
 * @version 0.0.2
 * @since 0.0.2
 */
export default abstract class BaseAdminService<T extends BaseDTO, Search = any, Value = any> {
  abstract findAll(page: PaginationDto, search: Search): Promise<[number, T[]]>;
  abstract findMany(page: PaginationDto, search: Search): Promise<[number, T[]]>;
  abstract findOne(search: Search): Promise<T>;
  abstract findById(id: number): Promise<T>;
  abstract create(createObj: T): Promise<T>;
  abstract update(search: Search, updateObj: T): Promise<T>;
  abstract delete(search: Search): Promise<Value>;

  entityToDTO<E extends BaseEntity>(entity: E): Promise<T> {
    return Promise.resolve(<T>(<unknown>entity));
  }

  entityToDTOs<E extends BaseEntity>(entities: E[]): Promise<T[]> {
    const dto = [];
    for (const entity of entities) {
      dto.push(<T>(<unknown>entity));
    }

    return Promise.resolve(dto);
  }
}
