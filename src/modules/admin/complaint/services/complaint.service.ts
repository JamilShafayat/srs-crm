import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUserDto } from 'src/common/dto/admin-user.dto';
import { PaginationDto } from 'src/common/dto/Pagination.dto';
import { ClientEntity } from 'src/common/entities/client.entity';
import { ComplaintEntity } from 'src/common/entities/complaint.entity';
import { ProjectEntity } from 'src/common/entities/project.entity';
import { CustomException } from 'src/common/exceptions/customException';
import { Connection, Equal, Repository } from 'typeorm';
import { ComplaintFilterListDto } from '../dto/complaint-filter-list.dto';
import { CreateComplaintDto } from '../dto/create-complaint.dto';
import { StatusChangeComplaintDto } from '../dto/status-change-complaint.dto';
import { UpdateComplaintDto } from '../dto/update-complaint.dto';

@Injectable()
export class ComplaintService {
	constructor(
		@InjectRepository(ClientEntity)
		private readonly clientRepository: Repository<ClientEntity>,
		@InjectRepository(ProjectEntity)
		private readonly projectRepository: Repository<ProjectEntity>,
		@InjectRepository(ComplaintEntity)
		private readonly complaintRepository: Repository<ComplaintEntity>,
		private connection: Connection,
	) { }

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

			const total = await this.complaintRepository.count({
				where: { ...whereCondition },
			});

			return [complaints, total];
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async create(createComplaintDto: CreateComplaintDto, user: AdminUserDto) {
		try {
			const { title, description, screenshot, client_id, project_id } =
				createComplaintDto;

			// find client
			const findClient = await this.clientRepository.findOne({
				where: { id: client_id },
			});

			if (!findClient) {
				throw new NotFoundException('No client found on this id!');
			}

			// find project
			const findProject = await this.projectRepository.findOne({
				where: { id: project_id },
			});

			if (!findProject) {
				throw new NotFoundException('No project found on this id!');
			}

			const newComplaint = {
				title,
				description,
				screenshot,
				client_id,
				project_id,
				created_by: user.id,
			};

			const createComplaint = await this.complaintRepository.save(newComplaint);

			const complaint = await this.projectRepository.findOne({
				where: { id: createComplaint.id },
				relations: ['client_info', 'project_info'],
			});

			return complaint;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findAllList() {
		try {
			// find all active complaint
			const complaint = await this.complaintRepository.findAndCount({
				status: 1,
			});

			return complaint;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async findOne(id: string): Promise<ComplaintEntity> {
		try {
			// find single complaint
			const complaint = await this.complaintRepository.findOne({
				where: { id },
				relations: ['client_info', 'project_info'],
			});

			if (!complaint) {
				throw new NotFoundException('No complaint found on this id!');
			}
			return complaint;
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
			// find complaint
			const findComplaint = await this.complaintRepository.findOne(id);

			if (!findComplaint) {
				throw new NotFoundException('No complaint found on this id!');
			}

			// update single complaint
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

			const complaint = await this.complaintRepository.findOne({
				where: { id },
				relations: ['client_info', 'project_info'],
			});

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
			// find complaint
			const findComplaint = await this.complaintRepository.findOne(id);

			if (!findComplaint) {
				throw new NotFoundException('No complaint found on this id!');
			}

			await this.complaintRepository.update(
				{
					id: id,
				},
				{
					status: statusChangeComplaintDto.status,
					updated_by: user.id,
				},
			);

			const complaint = await this.complaintRepository.findOne(id);

			return complaint;
		} catch (error) {
			throw new CustomException(error);
		}
	}

	async remove(id: string, user: AdminUserDto) {
		try {
			// find complaint
			const complaint = await this.complaintRepository.findOne({ id: id });

			if (!complaint) {
				throw new NotFoundException('No Complaint Found!');
			}

			await this.connection.transaction(async (manager) => {
				await manager.getRepository<ComplaintEntity>('complaints').update(
					{
						id: id,
					},
					{
						deleted_by: user.id,
					},
				);

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
			// find complaint
			const complaint = await this.complaintRepository.find({
				where: { id },
				withDeleted: true,
			});

			if (!complaint) {
				throw new NotFoundException('No Complaint Found!');
			}

			await this.complaintRepository.delete(id);

			return true;
		} catch (error) {
			throw new CustomException(error);
		}
	}
}
