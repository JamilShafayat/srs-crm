import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    type: String,
    description: 'Team name',
    default: 'Team One',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
}
