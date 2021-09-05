import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    type: String,
    description: 'Client Name',
    default: 'Mr. Name',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  full_name: string;

  @ApiProperty({
    type: String,
    description: 'Client Address',
    default: 'Bangladesh',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  address: string;

  @ApiProperty({
    type: String,
    description: 'User Id',
    default: 'ee4e9927-e59a-4ce1-9379-1380db160a37',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
