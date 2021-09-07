import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { DesignationEntity } from './designation.entity';
import { TeamEmployeeEntity } from './team_employee.entity';
import { UserEntity } from './user.entity';

@Entity('employees')
export class EmployeeEntity extends CommonEntity {
  @Column({ unique: true, nullable: false })
  full_name: string;

  @Column({ nullable: true })
  expertise: string;

  @Column({ unique: true, nullable: false })
  user_id: string;

  @OneToOne(() => UserEntity, (user: any) => user)
  @JoinColumn({ name: 'user_id' })
  user_info: UserEntity;

  @Column({ unique: false, nullable: false })
  designation_id: string;

  @OneToOne(() => DesignationEntity, (designation: any) => designation)
  @JoinColumn({ name: 'designation_id' })
  designation_info: DesignationEntity;

  @OneToMany(() => TeamEmployeeEntity, (teamEmployee: any) => teamEmployee)
  team_employees: TeamEmployeeEntity[];
}
