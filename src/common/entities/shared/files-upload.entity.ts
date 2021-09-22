import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../common.entity';

@Entity('uploaded_files')
export class FileUploadEntity extends CommonEntity {
  @Column({ nullable: false })
  file_name: string;
}