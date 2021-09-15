import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamEmployeeDto {
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
    description: 'Employee id',
    default: '49ce8d06-02e3-4cb6-a06e-732f8bf72057',
  })
  @IsString()
  @IsNotEmpty()
  employee_id: string;
}
