import { Module } from '@nestjs/common';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { AdminAuthModule } from './auth/auth.module';
import { TestsModule } from './testPart/text.module';
import { UsersModule } from './users/users.module';

export const AdminModuleList = [
  AdminAuthModule,
  UsersModule,
  FileUploadModule,
  TestsModule,
];
@Module({
  imports: AdminModuleList,
})
export class AdminModule {}
