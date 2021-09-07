import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ComplaintIdParamDto {
  @ApiProperty({ type: String, description: 'Complaint Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
