import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { MailModule } from 'src/modules/mail/mail.module';
import { RegistrationsController } from './controllers/registrations.controller';
import { RegistrationService } from './services/registrations.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MailModule],
  controllers: [RegistrationsController],
  providers: [RegistrationService],
})
export class RegistrationsModule {}
