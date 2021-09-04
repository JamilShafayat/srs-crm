import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CommonEntity } from './common.entity';
import { ComplaintEntity } from './complaint.entity';
import { TeamEntity } from './team.entity';

@Entity('projects')
export class ProjectEntity extends CommonEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  feature: string;

  @Column({ type: Date, nullable: false })
  initiate_date: Date;

  @Column({ type: Date, nullable: false })
  completion_date: Date;

  @Column({ unique: false, nullable: false })
  team_id: string;

  @OneToOne(() => TeamEntity, (team: any) => team)
  @JoinColumn({ name: 'team_id' })
  team_info: TeamEntity;

  @Column({ unique: false, nullable: false })
  client_id: string;

  @OneToOne(() => ClientEntity, (client: any) => client)
  @JoinColumn({ name: 'client_id' })
  client_info: ClientEntity;

  @OneToMany(() => ComplaintEntity, (complaint: any) => complaint)
  complaint_info: ComplaintEntity;
}
