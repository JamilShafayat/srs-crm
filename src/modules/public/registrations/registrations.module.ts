import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserEntity } from 'src/common/entities/admin/users/user.entity';
import { MailModule } from 'src/modules/mail/mail.module';
import { RegistrationsController } from './controllers/registrations.controller';
import { RegistrationService } from './services/registrations.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity]), MailModule],
  controllers: [RegistrationsController],
  providers: [RegistrationService],
})
export class RegistrationsModule {}
