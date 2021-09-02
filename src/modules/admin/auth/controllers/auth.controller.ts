import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { PayloadResponseDTO } from '../../../../common/dto/payload-response.dto';
import { DtoValidationPipe } from '../../../../common/pipes/dtoValidation.pipe';
import { AdminAuthDto } from '../dto/auth.dto';
import { AdminAuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('/')
  @ApiResponse({
    description: 'Successfully logged in.',
    status: HttpStatus.OK,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiForbiddenResponse({ description: 'Invalid credentials / inactive' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
  @ApiBody({ type: AdminAuthDto })
  async auth(@Body(new DtoValidationPipe()) authData: AdminAuthDto) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('123456', salt);
    const auth = await this.authService.auth(authData);

    return new PayloadResponseDTO({
      statusCode: HttpStatus.OK,
      message: 'Successfully logged in',
      data: { auth },
    });
  }
}
