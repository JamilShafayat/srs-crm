import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import StringToNumericTransformer from '../../../../common/dto/transformer/string-to-numeric.transformer';

export class TagUpdateParamDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @Transform(StringToNumericTransformer)
  @IsNotEmpty()
  exampleId: number;

  @ApiProperty({ type: Number })
  @Min(1)
  @IsNumber()
  @Transform(StringToNumericTransformer)
  @IsNotEmpty()
  tagId: number;
}
