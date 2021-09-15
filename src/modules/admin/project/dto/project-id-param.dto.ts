import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectIdParamDto {
  @ApiProperty({ type: String, description: 'Project id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
