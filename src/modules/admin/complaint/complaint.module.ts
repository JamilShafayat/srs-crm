import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/common/entities/client.entity';
import { ComplaintEntity } from 'src/common/entities/complaint.entity';
import { ProjectEntity } from 'src/common/entities/project.entity';
import { ComplaintController } from './controllers/complaint.controller';
import { ComplaintService } from './services/complaint.service';

@Module({
	imports: [TypeOrmModule.forFeature([ClientEntity, ProjectEntity, ComplaintEntity])],
	controllers: [ComplaintController],
	providers: [ComplaintService],
})
export class ComplaintModule { }
