import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import PaginationBaseDTO from '../../../../common/dto/pagination-base.dto';

export class GetItemsDTO extends PaginationBaseDTO {
  @ApiProperty({ type: String, description: 'Company Name', default: 'SIMEC' })
  @IsString()
  companyName: string;
}
