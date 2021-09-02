import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { TestTypeEnum } from 'src/common/enums/admin/test-type.enum';

export class CreateTestDto {
  @ApiProperty({
    type: String,
    description: 'Test Name',
    default: 'Test Xos',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    type: String,
    description: 'Test Type',
    default: TestTypeEnum.TEST_ONE,
  })
  @IsEnum(TestTypeEnum, { message: 'Test Type' })
  type: string;
}
