/**
 * @description base DTO
 * @author xoss point
 * @version 0.0.2
 * @since 0.0.2
 */
import { ApiProperty } from '@nestjs/swagger';

export default abstract class PaginationBaseDTO {
  @ApiProperty({ type: Number, description: 'Page number', default: 1 })
  page: number;

  @ApiProperty({ type: Number, description: 'Data limit', default: 10 })
  limit: number;
}
