import { BaseEntity } from 'typeorm';
export declare abstract class CommonEntity extends BaseEntity {
    id: string;
    status: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}
