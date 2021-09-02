import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity('tests')
export class TestEntity extends CommonEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  type: string;
}
