import { IsEmail } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserTypeEnum } from '../enums/admin/user-type.enum';
import { ClientEntity } from './client.entity';
import { CommentEntity } from './comment.entity';
import { CommonEntity } from './common.entity';
import { EmployeeEntity } from './employee.entity';

@Entity('users')
export class UserEntity extends CommonEntity {
	@Column({ unique: true, nullable: false })
	name: string;

	@Column({ unique: true, nullable: false })
	phone: string;

	@Column({ unique: true, nullable: false })
	@IsEmail()
	email: string;

	@Column({ unique: false, nullable: true })
	password: string;

	@Column({
		type: 'enum',
		enum: UserTypeEnum,
		default: UserTypeEnum.GENERAL_EMPLOYEE,
	})
	user_type: string;

	@OneToOne(() => ClientEntity, (client) => client.user_info)
	client_info: ClientEntity;

	@OneToOne(() => EmployeeEntity, (employee) => employee)
	employee_info: EmployeeEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.user_info)
	comments: CommentEntity[];
}
