import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ComplaintEntity } from './complaint.entity';
import { UserEntity } from './user.entity';

@Entity('comments')
export class CommentEntity extends CommonEntity {
	@Column({ nullable: false })
	body: string;

	@Column({ unique: true, nullable: false })
	user_id: string;

	@ManyToOne(() => UserEntity, (user: any) => user.comments)
	@JoinColumn({ name: 'user_id' })
	user_info: UserEntity;

	@Column({ unique: false, nullable: false })
	complaint_id: string;

	@ManyToOne(() => ComplaintEntity, (complaint: any) => complaint.comments)
	@JoinColumn({ name: 'complaint_id' })
	complaint_info: ComplaintEntity;
}
