import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class MediaStoreDto {
  @ApiProperty({ type: String })
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  mediaTitle: string;

  @ApiProperty({ type: String })
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  mediaUrl: string;
}
