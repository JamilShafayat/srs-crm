import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateClientDto extends CreateUserDto {
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
}
