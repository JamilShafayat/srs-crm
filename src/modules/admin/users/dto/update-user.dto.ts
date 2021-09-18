import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserTypeEnum } from './../../../../common/enums/admin/user-type.enum';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'User full name',
    default: 'Mr. Name',
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

  @ApiProperty({
    type: String,
    description: 'User type',
    default: UserTypeEnum.SUPER_ADMIN,
  })
  @IsEnum(UserTypeEnum, { message: 'User type' })
  user_type: string;
}
