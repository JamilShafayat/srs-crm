import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminAuthDto {
	@ApiProperty({
		type: String,
		description: 'Login identifier',
		default: '01711033730',
	})
	@MaxLength(200)
	@MinLength(10)
	@IsString()
	@IsNotEmpty()
	identifier: string;

	@ApiProperty({
		type: String,
		description: 'User password',
		default: '123456',
	})
	@MaxLength(200)
	@MinLength(6)
	@IsString()
	@IsNotEmpty()
	password: string;
}
