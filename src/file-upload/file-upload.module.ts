import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadEntity } from 'src/common/entities/shared/files-upload.entity';
import { FileUploadController } from './controller/file-upload.controller';

@Module({
	imports: [TypeOrmModule.forFeature([FileUploadEntity])],
	controllers: [FileUploadController],
	providers: [],
})

export class FileUploadModule { }
