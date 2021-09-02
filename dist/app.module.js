"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_redis_1 = require("nestjs-redis");
const http_exception_filter_1 = require("./common/filter/http-exception.filter");
const payload_logging_interceptor_1 = require("./common/interceptors/payload-logging.interceptor");
const admin_module_1 = require("./modules/admin/admin.module");
const mail_module_1 = require("./modules/mail/mail.module");
const public_module_1 = require("./modules/public/public.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                insecureAuth: false,
                type: 'mysql',
                host: process.env.DATABASE_HOST,
                port: Number(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_DB,
                synchronize: process.env.SYNCHRONIZE && process.env.SYNCHRONIZE === 'true',
                logging: true,
                dropSchema: false,
                entities: ['dist/**/*.entity.js'],
            }),
            nestjs_redis_1.RedisModule.register([
                {
                    url: process.env.REDIS_SESSION,
                    name: 'REDIS_SESSION',
                },
                {
                    url: process.env.REDIS_TMP_FILE,
                    name: 'REDIS_TMP_FILE',
                },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            admin_module_1.AdminModule,
            public_module_1.PublicModule,
            mail_module_1.MailModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: payload_logging_interceptor_1.PayloadLoggingInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map