import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty({
    type: String,
    description: 'Test Name',
    default: 'Test Xos',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;
}
