import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class EmployeeIdParamDto {
  @ApiProperty({ type: String, description: 'Employee Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
