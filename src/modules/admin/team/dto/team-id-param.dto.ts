import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TeamIdParamDto {
  @ApiProperty({ type: String, description: 'Team id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
