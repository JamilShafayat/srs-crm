import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CommentEntity } from './comment.entity';
import { CommonEntity } from './common.entity';
import { ProjectEntity } from './project.entity';

@Entity('complaints')
export class ComplaintEntity extends CommonEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  screenshot: string;

  @Column({ unique: false, nullable: false })
  client_id: string;

  @OneToOne(() => ClientEntity, (client: any) => client.complaints)
  @JoinColumn({ name: 'client_id' })
  client_info: ClientEntity;

  @Column({ unique: false, nullable: false })
  project_id: string;

  @OneToOne(() => ProjectEntity, (project: any) => project)
  @JoinColumn({ name: 'project_id' })
  project_info: ProjectEntity;

  @OneToMany(() => CommentEntity, (comment: any) => comment)
  comments: CommentEntity[];
}
