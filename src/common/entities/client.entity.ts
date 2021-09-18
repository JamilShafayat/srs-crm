import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ComplaintEntity } from './complaint.entity';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';

@Entity('clients')
export class ClientEntity extends CommonEntity {
	@Column({ unique: true, nullable: false })
	full_name: string;

	@Column({ nullable: true })
	address: string;

	@Column({ unique: true, nullable: false })
	user_id: string;

	@OneToOne(() => UserEntity, (user: any) => user.client_info)
	@JoinColumn({ name: 'user_id' })
	user_info: UserEntity;

	@OneToMany(() => ComplaintEntity, (complaint: any) => complaint.client_info)
	complaints: ComplaintEntity[];

	@OneToMany(() => ProjectEntity, (project: any) => project.client_info)
	projects: ProjectEntity[];
}
