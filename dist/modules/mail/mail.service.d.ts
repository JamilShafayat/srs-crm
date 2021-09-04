import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/common/entities/user.entity';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmation(user: UserEntity, token: string): Promise<void>;
}
