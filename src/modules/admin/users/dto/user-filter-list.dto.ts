import { ApiProperty } from '@nestjs/swagger';
import PaginationBaseDTO from 'src/common/dto/pagination-base.dto';

export class UserFilterListDto extends PaginationBaseDTO {
  @ApiProperty({
    type: String,
    description: 'Status',
    default: '',
    required: false,
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'Mobile Number',
    default: '',
    required: false,
  })
  phone: string;
}
