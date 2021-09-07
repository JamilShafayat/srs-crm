import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CommentIdParamDto {
  @ApiProperty({ type: String, description: 'Comment Id' })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  id: string;
}
