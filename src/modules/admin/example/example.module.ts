import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from '../../../common/services/file-upload.service';
import { ExampleController } from './controllers/example.controller';
import { ExampleService } from './services/example.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [ExampleController],
  providers: [ExampleService, FileUploadService],
})

export class ExampleModule {}
