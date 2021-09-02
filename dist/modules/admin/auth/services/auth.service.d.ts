import { Repository } from 'typeorm';
import { AdminUserEntity } from '../../../../common/entities/admin/users/user.entity';
import { AdminAuthDto } from '../dto/auth.dto';
export declare class AdminAuthService {
    private readonly adminUserRepository;
    constructor(adminUserRepository: Repository<AdminUserEntity>);
    auth(auth: AdminAuthDto): Promise<{
        user_id: string;
        userType: string;
        token: string;
    }>;
    login(user: AdminUserEntity): string;
}
