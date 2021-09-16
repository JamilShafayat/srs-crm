import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { EmployeeEntity } from './employee.entity';

@Entity('designations')
export class DesignationEntity extends CommonEntity {
	@Column({ unique: true, nullable: false })
	name: string;

	@OneToMany(() => EmployeeEntity, (employee: any) => employee.designation_info)
	employees: EmployeeEntity[];
}
