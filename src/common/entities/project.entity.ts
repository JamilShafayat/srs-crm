import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CommonEntity } from './common.entity';
import { ComplaintEntity } from './complaint.entity';
import { TeamEntity } from './team.entity';

@Entity('projects')
export class ProjectEntity extends CommonEntity {
	@Column({ unique: true, nullable: false })
	name: string;

	@Column({ nullable: true })
	feature: string;

	@Column({ nullable: false })
	initiate_date: string;

	@Column({ nullable: true })
	completion_date: string;

	@Column({ unique: false, nullable: false })
	team_id: string;

	@ManyToOne(() => TeamEntity, (team: any) => team.projects)
	@JoinColumn({ name: 'team_id' })
	team_info: TeamEntity;

	@Column({ unique: false, nullable: false })
	client_id: string;

	@ManyToOne(() => ClientEntity, (client: any) => client.projects)
	@JoinColumn({ name: 'client_id' })
	client_info: ClientEntity;

	@OneToMany(() => ComplaintEntity, (complaint: any) => complaint)
	complaints: ComplaintEntity[];
}
