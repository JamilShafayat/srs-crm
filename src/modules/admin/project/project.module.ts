import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/common/entities/client.entity';
import { ProjectEntity } from 'src/common/entities/project.entity';
import { TeamEntity } from 'src/common/entities/team.entity';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';

@Module({
	imports: [TypeOrmModule.forFeature([ClientEntity, TeamEntity, ProjectEntity])],
	controllers: [ProjectController],
	providers: [ProjectService],
})
export class ProjectModule { }
