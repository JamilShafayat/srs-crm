import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ComplaintEntity } from 'src/common/entities/complaint.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { ComplaintFilterListDto } from '../dto/complaint-filter-list.dto';
import { CreateComplaintDto } from '../dto/create-complaint.dto';
import { StatusChangeComplaintDto } from '../dto/status-change-complaint.dto';
import { UpdateComplaintDto } from '../dto/update-complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(ComplaintEntity)
    private readonly complaintRepository: Repository<ComplaintEntity>,
    private connection: Connection,
  ) {}

  async findAll(
    filter: ComplaintFilterListDto,
    pagination: PaginationDto,
  ): Promise<[ComplaintEntity[], number]> {
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

      //find complaints
      const complaints = await this.complaintRepository.find({
        where: {
          ...whereCondition,
        },
        order: { created_by: 'DESC' },
        skip: pagination.skip,
        take: pagination.limit,
        relations: ['client_info', 'project_info'],
      });

      //count total complaints
      const total = await this.complaintRepository.count({
        where: { ...whereCondition },
      });

      // Return Fetched Data
      return [complaints, total];
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async create(createComplaintDto: CreateComplaintDto, user: AdminUserDto) {
    try {
      const { title, description, screenshot, client_id, project_id } =
        createComplaintDto;

      //data store
      const data = {
        title,
        description,
        screenshot,
        client_id,
        project_id,
        created_by: user.id,
      };

      const addedComplaintData = await this.complaintRepository.save(data);

      // Created data return
      return addedComplaintData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findAllList() {
    try {
      // All Active Data Fetch
      const expectedData = await this.complaintRepository.findAndCount({
        status: 1,
      });

      // Return Fetched Data
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async findOne(id: string): Promise<ComplaintEntity> {
    try {
      // single complaint fetch
      const expectedData = await this.complaintRepository.findOne({
        where: { id },
        relations: ['client_info', 'project_info'],
      });

      // Complaint not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Complaint Found!');
      }
      return expectedData;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async update(
    id: string,
    updateComplaintDto: UpdateComplaintDto,
    user: AdminUserDto,
  ) {
    try {
      //update data
      await this.complaintRepository.update(
        {
          id: id,
        },
        {
          title: updateComplaintDto.title,
          description: updateComplaintDto.description,
          screenshot: updateComplaintDto.screenshot,
          client_id: updateComplaintDto.client_id,
          project_id: updateComplaintDto.project_id,
          updated_by: user.id,
        },
      );

      // Updated row getting
      const complaint = await this.complaintRepository.findOne({
        where: { id },
        relations: ['client_info', 'project_info'],
      });

      //return updated row
      return complaint;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async status(
    id: string,
    statusChangeComplaintDto: StatusChangeComplaintDto,
    user: AdminUserDto,
  ) {
    try {
      // Find complaint
      const expectedData = await this.complaintRepository.findOne(id);

      // complaint not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Complaint Found!');
      }

      //update complaint status
      await this.complaintRepository.update(
        {
          id: id,
        },
        {
          status: statusChangeComplaintDto.status,
          updated_by: user.id,
        },
      );

      // Updated complaint fetch
      const complaint = await this.complaintRepository.findOne(id);

      //return updated complaint
      return complaint;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async remove(id: string, user: AdminUserDto) {
    try {
      // Find complaint
      const expectedData = await this.complaintRepository.findOne({ id: id });

      // complaint not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Complaint Found!');
      }

      await this.connection.transaction(async (manager) => {
        //Update Deleted By
        await manager.getRepository<ComplaintEntity>('complaints').update(
          {
            id: id,
          },
          {
            deleted_by: user.id,
          },
        );

        //Soft delete complaint
        await manager
          .getRepository<ComplaintEntity>('complaints')
          .softDelete(id);
        return true;
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  async finalDelete(id: string) {
    try {
      // Find complaint
      const expectedData = await this.complaintRepository.find({
        where: { id },
        withDeleted: true,
      });

      // Data not found throw an error.
      if (!expectedData) {
        throw new NotFoundException('No Complaint Found!');
      }

      //Delete data
      await this.complaintRepository.delete(id);

      //Return
      return true;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
