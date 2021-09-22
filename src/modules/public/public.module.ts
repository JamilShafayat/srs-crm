import { Module } from '@nestjs/common';
import { RegistrationsModule } from './registrations/registrations.module';

export const PublicModuleList = [RegistrationsModule];
@Module({
	imports: PublicModuleList,
})

export class PublicModule { }
