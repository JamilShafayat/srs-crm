import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ClientEntity } from 'src/common/entities/client.entity';
import { UserEntity } from 'src/common/entities/user.entity';
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
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

      //find clients
      const clients = await this.clientRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['user_info'],
      });

      //count total client
      const total = await this.clientRepository.count({
        where: { ...whereCondition },
      });

      // return fetched client
      return [clients, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createClientDto: CreateClientDto, user: AdminUserDto) {
    try {
      const { name, phone, email, password, user_type } = createClientDto;

      //find existing user
      const findUser = await this.userRepository.findOne({ phone });

      if (findUser) {
        throw new ValidationException([
          {
            field: 'phone',
            message: 'User Already Exists.',
          },
        ]);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        name,
        phone,
        email,
        user_type,
        password: hashedPassword,
        created_by: user.id,
      };

      const createUser = await this.userRepository.save(newUser);

      const { full_name, address } = createClientDto;

      const newClient = {
        full_name,
        address,
        user_id: createUser.id,
        created_by: user.id,
      };

      const createClient = await this.clientRepository.save(newClient);

      return createClient;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // find all active clients
      const findClient = await this.clientRepository.findAndCount({
        status: 1,
      });

      return findClient;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<ClientEntity> {
    try {
      // Single client fetch
      const findClient = await this.clientRepository.findOne({
        where: { id },
        relations: ['user_info'],
      });

      // User not found throw an error.
      if (!findClient) {
        throw new NotFoundException('No Client Found!');
      }
      return findClient;
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
      await this.clientRepository.update(
        {
          id: id,
        },
        {
          full_name: updateClientDto.full_name,
          address: updateClientDto.address,
          updated_by: user.id,
        },
      );

      const client = await this.clientRepository.findOne({
        where: { id },
        relations: ['user_info'],
      });

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
      // search client
      const findUser = await this.clientRepository.findOne(id);

      // client not found throw an error.
      if (!findUser) {
        throw new NotFoundException('No Client Found!');
      }

      await this.clientRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeClientDto.status,
          updated_by: user.id,
        },
      );

      const client = await this.clientRepository.findOne(id);

      return client;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // find client
      const findClient = await this.clientRepository.findOne({ id: id });

      // client not found throw an error.
      if (!findClient) {
        throw new NotFoundException('No Client Found!');
      }

      await this.connection.transaction(async (manager) => {
        // update deleted by
        await manager.getRepository<ClientEntity>('clients').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //soft delete client
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
      const findClient = await this.clientRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!findClient) {
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
