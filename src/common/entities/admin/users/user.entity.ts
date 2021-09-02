import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { UserTypeEnum } from '../../../enums/admin/user-type.enum';
import { CommonEntity } from '../../common.entity';
import { DesignationEntity } from '../designation/designation.entity';

@Entity('admin_users')
export class AdminUserEntity extends CommonEntity {
  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  designation_id: string;

  @OneToMany((type) => DesignationEntity, (designation) => designation.id)
  @JoinColumn({ name: 'designation_id' })
  designation_info: DesignationEntity;

  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.GENERAL_USER,
  })
  user_type: string;
}
