import { PayloadResponseDTO } from '../../../../common/dto/payload-response.dto';
import { AdminAuthDto } from '../dto/auth.dto';
import { AdminAuthService } from '../services/auth.service';
export declare class AdminAuthController {
    private readonly authService;
    constructor(authService: AdminAuthService);
    auth(authData: AdminAuthDto): Promise<PayloadResponseDTO>;
}
