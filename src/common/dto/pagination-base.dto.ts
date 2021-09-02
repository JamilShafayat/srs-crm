/**
 * @description base DTO
 * @author Nurun Nobi Shamim
 * @version 0.0.2
 * @since 0.0.2
 */
import { ApiProperty } from '@nestjs/swagger';

export default abstract class PaginationBaseDTO {
  @ApiProperty({ type: Number, description: 'Page Number', default: 1 })
  page: number;

  @ApiProperty({ type: Number, description: 'Data Limit', default: 10 })
  limit: number;
}
