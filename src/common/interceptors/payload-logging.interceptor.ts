import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import * as cli_color from 'cli-color';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as winston from 'winston';

/**
 * LoggingInterceptor Use for log every request
 * @class
 * @version 1.0.0
 * @since 1.0.0
 * @author asraful Islam <asraful009@gmail.com>
 * @copyright
 * @global
 */
@Injectable()
export class PayloadLoggingInterceptor implements NestInterceptor {
	/**
	 * @since 1.0.0
	 * @name logger
	 * @private
	 * @constant
	 */

	private readonly logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.Console({
					level: 'error',
					format: winston.format.combine(
						nestWinstonModuleUtilities.format.nestLike('BTB'),
					),
				}),
				new winston.transports.Console({
					level: 'info',
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.printf(
							(info) =>
								//`${greenBright}` +
								`${cli_color.blueBright(info.remoteIP)} ` +
								`[${cli_color.greenBright(info.timestamp)}] ` +
								`${cli_color.yellowBright(info.context)} ` +
								`${cli_color.cyanBright(info.method)} ` +
								`"${info.url}" ` +
								`${cli_color.magentaBright(info.statusCode)} ` +
								`${cli_color.yellow(info.processTime + 'ms')} ` +
								`${info.message.substring(0, 50)}...`,
						),
					),
				}),
				new winston.transports.File({
					filename: 'error.log',
					level: 'error',
					format: winston.format.combine(
						winston.format.timestamp(),
						nestWinstonModuleUtilities.format.nestLike('BTB'),
					),
				}),
				new winston.transports.File({
					filename: 'combined.log',
					level: 'info',
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.printf(
							(info) =>
								`${info.remoteIP}\t` +
								`[${info.timestamp}] ` +
								`"${info.method} ` +
								`${info.url}\t` +
								`${info.context}"\t` +
								`${info.statusCode} ` +
								`${info.processTime + 'ms'} ` +
								`${info.message}`,
						),
					),
				}),
			],
		});
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const className = context.getClass().name;
		const methodName = context.getHandler().name;
		const statusCode = context.switchToHttp().getResponse()['statusCode'];
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		const { method, socket, url } = request;
		const { remoteAddress } = socket;
		const now = Date.now();

		return next.handle().pipe(
			tap((s) => {
				this.logger.info({
					remoteIP: `${remoteAddress}`,
					method: `${method}`,
					processTime: `${Date.now() - now}`,
					statusCode: s.statusCode,
					url: `${url}`,
					context: `${className}/${methodName}`,
					message: `${JSON.stringify(s)}`,
				});
			}),
			map((payload) => {
				context.switchToHttp().getResponse()['statusCode'] = payload.statusCode;
				return {
					nonce: new Date().getTime(),
					error: {
						fields: {
							count: 0,
							errors: [],
						},
						systems: {
							count: 0,
							errors: [],
						},
					},
					status: payload.statusCode,
					message: payload.message,
					metadata: payload.metadata,
					payload: payload.data,
				};
			}),
			catchError((err) => {
				err['processTime'] = `${Date.now() - now}`;
				err['context'] = `${className}/${methodName}`;
				return throwError(err);
			}),
		);
	}
}
