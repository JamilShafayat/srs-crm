import { Module } from '@nestjs/common';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { AdminAuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { DesignationModule } from './designation/designation.module';
import { EmployeeModule } from './employee/employee.module';
import { ProjectModule } from './project/project.module';
import { TeamModule } from './team/team.module';
import { TestsModule } from './testPart/text.module';
import { UsersModule } from './users/users.module';

export const AdminModuleList = [
  AdminAuthModule,
  UsersModule,
  FileUploadModule,
  TestsModule,
  DesignationModule,
  ClientModule,
  EmployeeModule,
  TeamModule,
  ProjectModule,
];
@Module({
  imports: AdminModuleList,
})
export class AdminModule {}
