import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TeamEmployeeIdParamDto {
  @ApiProperty({ type: String, description: 'Team Employee Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
