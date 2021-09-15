import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ProjectEntity } from './project.entity';
import { TeamEmployeeEntity } from './team_employee.entity';

@Entity('teams')
export class TeamEntity extends CommonEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @OneToMany(() => ProjectEntity, (project: any) => project)
  projects: ProjectEntity[];

  @OneToMany(() => TeamEmployeeEntity, (teamEmployee: any) => teamEmployee)
  team_employees: TeamEmployeeEntity[];
}
