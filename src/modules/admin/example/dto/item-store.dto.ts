import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { TagStoreDTO } from './tag-store.dto';

export class ItemStoreDTO {
  @ApiProperty({ type: String, description: 'Company Name', default: 'SIMEC' })
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @MaxLength(250)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  @ApiProperty({ type: () => [TagStoreDTO] })
  @Type(() => TagStoreDTO)
  @ValidateNested()
  @IsArray()
  @IsNotEmpty()
  tags: TagStoreDTO[];

  @ApiProperty({ type: [Number], minimum: 1 })
  @Min(1, { each: true })
  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  categoryList: number[];
}
