import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { EmployeeEntity } from './employee.entity';
import { TeamEntity } from './team.entity';

@Entity('team_employees')
export class TeamEmployeeEntity extends CommonEntity {
  @Column({ unique: false, nullable: false })
  employee_id: string;

  @OneToMany(() => EmployeeEntity, (employee: any) => employee)
  @JoinColumn({ name: 'employee_id' })
  employee_info: EmployeeEntity;

  @Column({ unique: false, nullable: false })
  team_id: string;

  @OneToMany(() => TeamEntity, (team: any) => team)
  @JoinColumn({ name: 'team_id' })
  team_info: TeamEntity;
}
