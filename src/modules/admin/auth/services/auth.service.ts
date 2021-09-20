import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { ADMIN_JWT_SECRET } from '../../../../common/configs/config';
import { UserEntity } from '../../../../common/entities/user.entity';
import { CustomException } from '../../../../common/exceptions/customException';
import { AdminAuthDto } from '../dto/auth.dto';

@Injectable()
export class AdminAuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly adminUserRepository: Repository<UserEntity>,
	) { }

	async auth(
		auth: AdminAuthDto,
	): Promise<{ user_id: string; userType: string; token: string }> {
		try {
			//find user with identifier
			const user = await this.adminUserRepository.findOne({
				phone: auth.identifier,
			});

			if (!user) throw new ForbiddenException('Invalid Credentials');

			if (user.status === 0)
				throw new ForbiddenException(
					'You are inactive, please contact with admin',
				);

			//check password is valid
			const match = await bcrypt.compare(auth.password, user.password);

			if (!match) throw new ForbiddenException('Invalid Credentials');

			const token = this.login(user);
			const user_id = user.id;

			return {
				user_id,
				userType: user.user_type,
				token,
			};
		} catch (error) {
			throw new CustomException(error);
		}
	}

	login(user: UserEntity): string {
		const payload = { id: user.id, user_type: user.user_type };
		return jwt.sign(payload, ADMIN_JWT_SECRET);
	}
}
