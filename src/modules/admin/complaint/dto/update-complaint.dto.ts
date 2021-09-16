import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateComplaintDto {
	@ApiProperty({
		type: String,
		description: 'Complaint title',
		default: 'Complaint Title One',
	})
	@IsString()
	@MinLength(3)
	@MaxLength(200)
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		type: String,
		description: 'Complaint description',
		default: 'Complaint One',
	})
	@IsString()
	@MinLength(3)
	@MaxLength(200)
	description: string;

	@ApiProperty({
		type: String,
		description: 'Screenshot',
	})
	@IsString()
	@MinLength(3)
	@MaxLength(200)
	screenshot: string;

	@ApiProperty({
		type: String,
		description: 'Client id',
		default: 'b9dbd29c-ae6c-4df9-bd64-fc0c500c4606',
	})
	@IsString()
	@IsNotEmpty()
	client_id: string;

	@ApiProperty({
		type: String,
		description: 'Project id',
		default: 'f0d40ac9-27d4-4755-a3ed-c234153c51ba',
	})
	@IsString()
	@IsNotEmpty()
	project_id: string;
}
