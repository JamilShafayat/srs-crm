import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common.entity';
import { AdminUserEntity } from '../users/user.entity';

@Entity('designations')
export class DesignationEntity extends CommonEntity {
  @Column({ nullable: false })
  name: string;

  @OneToMany((type) => AdminUserEntity, (user) => user.id)
  user_info: AdminUserEntity;
}
