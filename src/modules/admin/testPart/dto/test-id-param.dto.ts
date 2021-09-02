import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TestIdParamDto {
  @ApiProperty({ type: String, description: 'Test Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
