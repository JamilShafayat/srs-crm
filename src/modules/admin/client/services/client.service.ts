import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ClientEntity } from 'src/common/entities/client.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { Connection, Equal, Repository } from 'typeorm';
import { ClientFilterListDto } from '../dto/client-filter-list.dto';
import { CreateClientDto } from '../dto/create-client.dto';
import { StatusChangeClientDto } from '../dto/status-change-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: ClientFilterListDto,
    pagination: PaginationDto,
  ): Promise<[ClientEntity[], number]> {
    try {
      const whereCondition = {};

      //status filter
      if (filter.status) {
        whereCondition['status'] = Equal(filter.status);
      }

      //state filter
      // if (filter.phone) {
      //   whereCondition['phone'] = Equal(filter.phone);
      // }

      //find users
      const clients = await this.clientRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['user_info'],
      });

      //count total categories
      const total = await this.clientRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [clients, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createClientDto: CreateClientDto, user: AdminUserDto) {
    try {
      const { full_name, address, user_id } = createClientDto;

      //find Existing Entry
      const findExisting = await this.clientRepository.findOne({ user_id });

      // Entry if found
      if (findExisting) {
        // throw an exception
        throw new ValidationException([
          {
            field: 'user_id',
            message: 'User Already  Exists.',
          },
        ]);
      }

      //Data store
      const data = {
        full_name,
        address,
        user_id,
        created_by: user.id,
      };

      const addedClientData = await this.clientRepository.save(data);

      // Created Data Return
      return addedClientData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.clientRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<ClientEntity> {
    try {
      // Single client fetch
      const expectedData = await this.clientRepository.findOne({
        where: { id },
      });

      // User not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Client Found!');
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    user: AdminUserDto,
  ) {
    try {
      //update data
      await this.clientRepository.update(
        {
          id: id,
        },
        {
          full_name: updateClientDto.full_name,
          address: updateClientDto.address,
          user_id: updateClientDto.user_id,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const client = await this.clientRepository.findOne(id);

      //return updated row
      return client;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeClientDto: StatusChangeClientDto,
    user: AdminUserDto,
  ) {
    try {
      // Find user
      const expectedData = await this.clientRepository.findOne(id);

      // client not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Client Found!');
      }

      //update client status
      await this.clientRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeClientDto.status,
          updated_by: user.id,
        },
      );

      // Updated user fetch
      const client = await this.clientRepository.findOne(id);

      //return updated client
      return client;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find client
      const expectedData = await this.clientRepository.findOne({ id: id });

      // Client not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Client Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<ClientEntity>('clients').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //Soft delete client
        await manager.getRepository<ClientEntity>('clients').softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find client
      const expectedData = await this.clientRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Client Found!');
      }

      //Delete data
      await this.clientRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
