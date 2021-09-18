import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator';
import { UserTypeEnum } from './../../../../common/enums/admin/user-type.enum';

export class CreateUserDto {
	@ApiProperty({
		type: String,
		description: 'User name',
		default: 'Mr. User One',
	})
	@IsString()
	@MinLength(3)
	@MaxLength(200)
	name: string;

	@ApiProperty({
		type: String,
		description: 'Mobile number',
		default: '01971033730',
	})
	@IsString()
	@MinLength(10)
	@MaxLength(200)
	phone: string;

	@ApiProperty({
		type: String,
		description: 'User email',
		default: 'email@gmail.com',
	})
	@MinLength(10)
	@MaxLength(200)
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ type: String, description: 'Password', default: '123456' })
	@IsString()
	@MinLength(6)
	@MaxLength(200)
	password: string;

	@ApiProperty({
		type: String,
		description: 'User type',
		default: UserTypeEnum.GENERAL_EMPLOYEE,
	})
	@IsEnum(UserTypeEnum, { message: 'User Type' })
	user_type: string;
}
