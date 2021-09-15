import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserIdParamDto {
  @ApiProperty({ type: String, description: 'User Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
