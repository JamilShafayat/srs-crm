import { ApiProperty } from '@nestjs/swagger';
import PaginationBaseDTO from 'src/common/dto/pagination-base.dto';

export class EmployeeFilterListDto extends PaginationBaseDTO {
  @ApiProperty({
    type: String,
    description: 'Status',
    default: '',
    required: false,
  })
  status: string;
}
