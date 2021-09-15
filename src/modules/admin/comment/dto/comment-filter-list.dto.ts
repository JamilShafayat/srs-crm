import { ApiProperty } from '@nestjs/swagger';
import PaginationBaseDTO from 'src/common/dto/pagination-base.dto';

export class CommentFilterListDto extends PaginationBaseDTO {
  @ApiProperty({
    type: String,
    description: 'Status',
    default: '',
    required: false,
  })
  status: string;
}
