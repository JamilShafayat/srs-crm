import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class DesignationIdParamDto {
  @ApiProperty({ type: String, description: 'Designation Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
