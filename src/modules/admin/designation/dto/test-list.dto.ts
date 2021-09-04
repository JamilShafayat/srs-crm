import { ApiProperty } from '@nestjs/swagger';
import PaginationBaseDTO from 'src/common/dto/pagination-base.dto';

export class TestListDto extends PaginationBaseDTO {
  @ApiProperty({
    type: String,
    description: 'Test type',
    default: '',
    required: false,
  })
  type: string;

  @ApiProperty({
    type: String,
    description: 'Status',
    default: '',
    required: false,
  })
  status: string;
}
