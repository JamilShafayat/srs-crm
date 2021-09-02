import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MediaStoreDto } from './media-store.dto';

export class TagStoreDTO {
  @ApiProperty()
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  tagName: string;

  @ApiProperty()
  @MaxLength(250)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  tagSlug: string;

  @ApiProperty({ type: () => [MediaStoreDto] })
  @Type(() => MediaStoreDto)
  @ValidateNested()
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  media: MediaStoreDto[];
}
