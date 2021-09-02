import { PayloadResponseDTO } from 'src/common/dto/payload-response.dto';
import { EntityManager } from 'typeorm';
import { RegistrationDto } from '../dto/registrations.dto';
import { RegistrationService } from '../services/registrations.service';
export declare class RegistrationsController {
    private readonly registrationService;
    constructor(registrationService: RegistrationService);
    create(registrationDto: RegistrationDto, manager: EntityManager): Promise<PayloadResponseDTO>;
}
