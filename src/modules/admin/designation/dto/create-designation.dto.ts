import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDesignationDto {
  @ApiProperty({
    type: String,
    description: 'Designation Name',
    default: 'Designation One',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
}
