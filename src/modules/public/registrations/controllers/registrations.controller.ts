import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { DtoValidationPipe } from 'src/common/pipes/dtoValidation.pipe';
import { EntityManager, TransactionManager } from 'typeorm';
import { RegistrationDto } from '../dto/registrations.dto';
import { RegistrationService } from '../services/registrations.service';

@Controller('v1/public/registrations')
@ApiTags('User Registration')
export class RegistrationsController {
	constructor(private readonly registrationService: RegistrationService) { }

	@Post()
	@ApiResponse({ description: 'User registration', status: HttpStatus.OK })
	@ApiBody({ type: RegistrationDto })
	async create(
		@Body(new DtoValidationPipe()) registrationDto: RegistrationDto,
		@TransactionManager() manager: EntityManager,
	) {
		const user = await this.registrationService.create(registrationDto);

		return new PayloadResponseDTO({
			statusCode: HttpStatus.OK,
			message: 'User registered successfully',
			data: { user },
		});
	}
}
