import { MailerService } from '@nestjs-modules/mailer';
import { AdminUserEntity } from 'src/common/entities/admin/users/user.entity';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmation(user: AdminUserEntity, token: string): Promise<void>;
}
