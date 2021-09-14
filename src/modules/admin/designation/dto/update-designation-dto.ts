import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDesignationDto {
  @ApiProperty({
    type: String,
    description: 'Designation name',
    default: 'Designation One',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
}
