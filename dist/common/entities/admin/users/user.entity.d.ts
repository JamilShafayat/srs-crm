import { CommonEntity } from '../../common.entity';
import { DesignationEntity } from '../designation/designation.entity';
export declare class AdminUserEntity extends CommonEntity {
    full_name: string;
    phone: string;
    password: string;
    designation_id: string;
    designation_info: DesignationEntity;
    user_type: string;
}
