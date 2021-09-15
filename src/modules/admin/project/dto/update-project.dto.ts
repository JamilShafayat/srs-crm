import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    type: String,
    description: 'Project name',
    default: 'Project One',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Project feature',
    default: 'Project Feature One',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  feature: string;

  @ApiProperty({
    type: String,
    description: 'Initiate date',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty()
  initiate_date: string;

  @ApiProperty({
    type: String,
    description: 'Completion date',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  completion_date: string;

  @ApiProperty({
    type: String,
    description: 'Team id',
    default: '4e01ec61-752d-4526-b31b-9221c65e8008',
  })
  @IsString()
  @IsNotEmpty()
  team_id: string;

  @ApiProperty({
    type: String,
    description: 'Client id',
    default: 'b9dbd29c-ae6c-4df9-bd64-fc0c500c4606',
  })
  @IsString()
  @IsNotEmpty()
  client_id: string;
}
