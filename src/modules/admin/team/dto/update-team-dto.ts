import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({
    type: String,
    description: 'Team Name',
    default: 'Team One',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
}
