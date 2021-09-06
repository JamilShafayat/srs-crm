import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusTypeEnum } from '../../../../common/enums/status/status.enum';

export class StatusChangeTeamDto {
  @ApiProperty({
    type: Number,
    description: 'Team Status',
    default: StatusTypeEnum.ACTIVE,
  })
  @IsEnum(StatusTypeEnum, { message: 'Status Should be 0 or 1' })
  status: number;
}
