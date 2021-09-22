import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { PayloadLoggingInterceptor } from './common/interceptors/payload-logging.interceptor';
import { AdminModule } from './modules/admin/admin.module';
import { MailModule } from './modules/mail/mail.module';
import { PublicModule } from './modules/public/public.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			insecureAuth: false,
			type: 'mysql',
			host: process.env.DATABASE_HOST,
			port: Number(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DB,
			synchronize:
				process.env.SYNCHRONIZE && process.env.SYNCHRONIZE === 'true',
			logging: true, // if true then will log database schema
			dropSchema: false,
			entities: ['dist/**/*.entity.js'],
		}),

		RedisModule.register([
			{
				url: process.env.REDIS_SESSION,
				name: 'REDIS_SESSION',
			},
			{
				url: process.env.REDIS_TMP_FILE,
				name: 'REDIS_TMP_FILE',
			},
		]),

		ConfigModule.forRoot({
			isGlobal: true, // no need to import into other modules
		}),

		AdminModule,
		PublicModule,
		MailModule,

		MulterModule.register({
			dest: './uploads',
		}),
	],

	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: PayloadLoggingInterceptor,
		},
	],
})

export class AppModule { PaginationDto}
