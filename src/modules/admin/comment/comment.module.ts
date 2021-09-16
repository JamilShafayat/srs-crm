import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/common/entities/comment.entity';
import { ComplaintEntity } from 'src/common/entities/complaint.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, ComplaintEntity, CommentEntity])],
	controllers: [CommentController],
	providers: [CommentService],
})
export class CommentModule { }
