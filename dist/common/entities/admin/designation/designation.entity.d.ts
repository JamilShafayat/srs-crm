import { CommonEntity } from '../../common.entity';
import { AdminUserEntity } from '../users/user.entity';
export declare class DesignationEntity extends CommonEntity {
    name: string;
    user_info: AdminUserEntity;
}
