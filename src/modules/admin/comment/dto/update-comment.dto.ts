import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    type: String,
    description: 'Comment Body',
    default: 'Comment Body',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    type: String,
    description: 'User Id',
    default: 'ee4e9927-e59a-4ce1-9379-1380db160a37',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    type: String,
    description: 'Complaint Id',
    default: '7ae61138-4826-487b-a3a5-ea9dc354ba2c',
  })
  @IsString()
  @IsNotEmpty()
  complaint_id: string;
}
