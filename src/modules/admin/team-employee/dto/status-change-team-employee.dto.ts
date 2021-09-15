import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusTypeEnum } from '../../../../common/enums/status/status.enum';

export class StatusChangeTeamEmployeeDto {
  @ApiProperty({
    type: Number,
    description: 'Team-employee Status',
    default: StatusTypeEnum.ACTIVE,
  })
  @IsEnum(StatusTypeEnum, { message: 'Status should be 0 or 1' })
  status: number;
}
