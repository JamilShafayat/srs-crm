import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserTypeEnum } from './../../../../common/enums/admin/user-type.enum';

export class UpdateAdminUserDto {
  @ApiProperty({
    type: String,
    description: 'User Full Name',
    default: 'Mr. Name',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    type: String,
    description: 'Mobile Number',
    default: '01971033730',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  phone: string;

  @ApiProperty({
    type: String,
    description: 'User Type',
    default: UserTypeEnum.SUPER_ADMIN,
  })
  @IsEnum(UserTypeEnum, { message: 'User Type' })
  user_type: string;
}
