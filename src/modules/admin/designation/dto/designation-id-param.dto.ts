import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class DesignationIdParamDto {
  @ApiProperty({ type: String, description: 'Designation id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
