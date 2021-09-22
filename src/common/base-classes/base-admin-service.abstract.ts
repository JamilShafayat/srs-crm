import { BaseEntity } from 'typeorm';
import BaseDTO from '../dto/base.dto';
import { PaginationDto } from '../dto/Pagination.dto';

/**
 * @description Base Service
 * @author Jamil Shafayat
 * @version 0.0.2
 * @since 0.0.2
 */
export default abstract class BaseAdminService<T extends BaseDTO, S = any, V = any> {
  abstract findAll(page: PaginationDto, search: S): Promise<[number, T[]]>;
  abstract findMany(page: PaginationDto, search: S): Promise<[number, T[]]>;
  abstract findOne(search: S): Promise<T>;
  abstract findById(id: number): Promise<T>;

  abstract create(createObj: T): Promise<T>;
  abstract update(search: S, updateObj: T): Promise<T>;
  abstract delete(search: S): Promise<V>;

  entityToDTO<E extends BaseEntity>(entity: E): Promise<T> {
    return Promise.resolve(<T>(<unknown>entity));
  }

  entityToDTOs<E extends BaseEntity>(entities: E[]): Promise<T[]> {
    const dtos = [];
    for (const entity of entities) {
      dtos.push(<T>(<unknown>entity));
    }
    return Promise.resolve(dtos);
  }
}
