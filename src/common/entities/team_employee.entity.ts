import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { EmployeeEntity } from './employee.entity';
import { TeamEntity } from './team.entity';

@Entity('team_employees')
export class TeamEmployeeEntity extends CommonEntity {
	@Column({ unique: false, nullable: false })
	employee_id: string;

	@ManyToOne(() => EmployeeEntity, (employee: any) => employee.team_employees)
	@JoinColumn({ name: 'employee_id' })
	employee_info: EmployeeEntity;

	@Column({ unique: false, nullable: false })
	team_id: string;

	@ManyToOne(() => TeamEntity, (team: any) => team.team_employees)
	@JoinColumn({ name: 'team_id' })
	team_info: TeamEntity;
}
