import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegistrationDto {
  @ApiProperty({
    type: String,
    description: 'User Full Name',
    default: 'Md Salman Sajib',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  full_name: string;

  @ApiProperty({
    type: String,
    description: 'Mobile Number',
    default: '01971033730',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  phone: string;

  @ApiProperty({ type: String, description: 'Password', default: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password: string;

  /*     @ApiProperty({type: String, description:'User Type', default: UserTypeEnum.GENERAL_USER})
    @IsEnum(UserTypeEnum, {message:"User Type"})
    user_type: string; */
}
