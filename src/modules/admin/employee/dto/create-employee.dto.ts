import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    type: String,
    description: 'Employee Full Name',
    default: 'Mr. Employee',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  full_name: string;

  @ApiProperty({
    type: String,
    description: 'Employee expertise',
    default: 'Sales',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  expertise: string;

  @ApiProperty({
    type: String,
    description: 'User Id',
    default: 'ee4e9927-e59a-4ce1-9379-1380db160a37',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    type: String,
    description: 'Designation Id',
    default: '6e05b867-03d5-4efc-9d87-8eb0dca2090a',
  })
  @IsString()
  @IsNotEmpty()
  designation_id: string;
}
