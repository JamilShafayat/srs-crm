import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({
    type: String,
    description: 'Employee full name',
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
    description: 'Designation id',
    default: 'f2e82a21-09fa-4cce-858b-27b208ec119c',
  })
  @IsString()
  @IsNotEmpty()
  designation_id: string;
}
