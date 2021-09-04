import { UserEntity } from 'src/common/entities/user.entity';
import { UserTypeEnum } from 'src/common/enums/admin/user-type.enum';
import { MailService } from 'src/modules/mail/mail.service';
import { Connection, Repository } from 'typeorm';
import { RegistrationDto } from '../dto/registrations.dto';
export declare class RegistrationService {
    private readonly adminUserRepository;
    private connection;
    private mailService;
    constructor(adminUserRepository: Repository<UserEntity>, connection: Connection, mailService: MailService);
    create(registrationDto: RegistrationDto): Promise<{
        full_name: string;
        phone: string;
        user_type: UserTypeEnum;
        password: any;
    } & UserEntity>;
}
