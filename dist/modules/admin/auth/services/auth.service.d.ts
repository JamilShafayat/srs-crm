import { Repository } from 'typeorm';
import { UserEntity } from '../../../../common/entities/user.entity';
import { AdminAuthDto } from '../dto/auth.dto';
export declare class AdminAuthService {
    private readonly adminUserRepository;
    constructor(adminUserRepository: Repository<UserEntity>);
    auth(auth: AdminAuthDto): Promise<{
        user_id: string;
        userType: string;
        token: string;
    }>;
    login(user: UserEntity): string;
}
