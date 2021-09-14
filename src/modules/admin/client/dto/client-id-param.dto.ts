import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ClientIdParamDto {
  @ApiProperty({ type: String, description: 'Client id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
