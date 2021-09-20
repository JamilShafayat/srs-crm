import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ClientEntity } from 'src/common/entities/client.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { UserTypeEnum } from 'src/common/enums/admin/user-type.enum';
import { CustomException } from 'src/common/exceptions/customException';
import { ValidationException } from 'src/common/exceptions/validationException';
import { MailService } from 'src/modules/mail/mail.service';
import { Connection, Repository } from 'typeorm';
import { RegistrationDto } from '../dto/registrations.dto';

@Injectable()
export class RegistrationService {
	constructor(
		@InjectRepository(ClientEntity)
		private readonly clientRepository: Repository<ClientEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private connection: Connection,
		private mailService: MailService,
	) { }

	async create(registrationDto: RegistrationDto) {
		try {
			const { name, phone, email, password, full_name, address } = registrationDto;

			const checkUserName = await this.userRepository.findOne({ name });
			const checkUserPhoneNumber = await this.userRepository.findOne({ phone });
			const checkClientFullName = await this.clientRepository.findOne({
				full_name,
			});

			// find existing user
			if (checkUserName || checkUserPhoneNumber) {
				throw new ValidationException([
					{
						field: checkUserName ? 'name' : 'phone',
						message:
							'This user name or phone number is already exists in the system.',
					},
				]);
			}

			// find existing client
			if (checkClientFullName) {
				throw new ValidationException([
					{
						field: 'full_name',
						message: 'This client full name is already exists in the system.',
					},
				]);
			}

			const user_type = UserTypeEnum.CLIENT;

			const hashedPassword = await bcrypt.hash(password, 12);
			const newUser = {
				name,
				phone,
				email,
				user_type,
				password: hashedPassword,
			};

			const createUser = await this.userRepository.save(newUser);

			const newClient = {
				full_name,
				address,
				user_id: createUser.id,
			};

			const createClient = await this.clientRepository.save(newClient);

			const client = await this.clientRepository.findOne({
				where: { id: createClient.id },
				relations: ['user_info'],
			});

			// send confirmation mail
			const token = Math.floor(1000 + Math.random() * 9000).toString();

			await this.mailService.sendUserConfirmation(createUser, token);

			return client;
		} catch (error) {
			throw new CustomException(error);
		}
	}
}
