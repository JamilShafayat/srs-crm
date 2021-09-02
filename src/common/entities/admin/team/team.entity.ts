import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common.entity';

@Entity('teams')
export class DestinationEntity extends CommonEntity {
  @Column({ nullable: false })
  name: string;
}
