"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const cli_color = require("cli-color");
const nest_winston_1 = require("nest-winston");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const winston = require("winston");
let PayloadLoggingInterceptor = class PayloadLoggingInterceptor {
    constructor() {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'error',
                    format: winston.format.combine(nest_winston_1.utilities.format.nestLike('BTB')),
                }),
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `${cli_color.blueBright(info.remoteIP)} ` +
                        `[${cli_color.greenBright(info.timestamp)}] ` +
                        `${cli_color.yellowBright(info.context)} ` +
                        `${cli_color.cyanBright(info.method)} ` +
                        `"${info.url}" ` +
                        `${cli_color.magentaBright(info.statusCode)} ` +
                        `${cli_color.yellow(info.processTime + 'ms')} ` +
                        `${info.message.substring(0, 50)}...`)),
                }),
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error',
                    format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike('BTB')),
                }),
                new winston.transports.File({
                    filename: 'combined.log',
                    level: 'info',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `${info.remoteIP}\t` +
                        `[${info.timestamp}] ` +
                        `"${info.method} ` +
                        `${info.url}\t` +
                        `${info.context}"\t` +
                        `${info.statusCode} ` +
                        `${info.processTime + 'ms'} ` +
                        `${info.message}`)),
                }),
            ],
        });
    }
    intercept(context, next) {
        const className = context.getClass().name;
        const methodName = context.getHandler().name;
        const statusCode = context.switchToHttp().getResponse()['statusCode'];
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const { rawHeaders, httpVersion, method, socket, url } = request;
        const { remoteAddress, remoteFamily } = socket;
        const now = Date.now();
        return next.handle().pipe((0, operators_1.tap)((s) => {
            this.logger.info({
                remoteIP: `${remoteAddress}`,
                method: `${method}`,
                processTime: `${Date.now() - now}`,
                statusCode: s.statusCode,
                url: `${url}`,
                context: `${className}/${methodName}`,
                message: `${JSON.stringify(s)}`,
            });
        }), (0, operators_1.map)((payload) => {
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
        }), (0, operators_1.catchError)((err) => {
            err['processTime'] = `${Date.now() - now}`;
            err['context'] = `${className}/${methodName}`;
            return (0, rxjs_1.throwError)(err);
        }));
    }
};
PayloadLoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PayloadLoggingInterceptor);
exports.PayloadLoggingInterceptor = PayloadLoggingInterceptor;
//# sourceMappingURL=payload-logging.interceptor.js.map