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
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const cli_color = require("cli-color");
const winston = require("winston");
const customInternalServerException_1 = require("../exceptions/customInternalServerException");
const paramValidationException_1 = require("../exceptions/paramValidationException");
const validationException_1 = require("../exceptions/validationException");
let HttpExceptionFilter = class HttpExceptionFilter {
    constructor() {
        this.serverErrorLog = winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: 'server_error.log',
                    level: 'error',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `${info.remoteIP}\t` +
                        `[${info.timestamp}] ` +
                        `"${info.method} ` +
                        `${info.url}\t` +
                        `${info.context}"\t` +
                        `${info.statusCode} \t` +
                        `${info.processTime + 'ms'} ` +
                        `${info.reqBody} \t` +
                        `${info.queryBody} \t` +
                        `${info.message}`)),
                }),
            ],
        });
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'error',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((err) => {
                        const statusCoror = this.getErrorBGC(+err.statusCode);
                        const str = statusCoror(`${cli_color.blueBright(err.remoteIP)} ` +
                            `[${cli_color.greenBright(err.timestamp)}] ` +
                            `${cli_color.yellowBright(err.context)} ` +
                            `${cli_color.cyanBright(err.method)} ` +
                            `"${err.url}" ` +
                            `${cli_color.magentaBright(err.statusCode)} ` +
                            `${cli_color.yellow(err.processTime + 'ms')} ` +
                            `${err.message.substring(0, 10) + '...'}`);
                        return `${str}`;
                    })),
                }),
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `${info.remoteIP}\t` +
                        `[${info.timestamp}] ` +
                        `"${info.method} ` +
                        `${info.url}\t` +
                        `${info.context}"\t` +
                        `${info.statusCode} ` +
                        `${info.processTime + 'ms'} ` +
                        `${info.reqBody} \t` +
                        `${info.queryBody} \t` +
                        `${info.message}`)),
                }),
            ],
        });
    }
    getErrorBGC(status = 500) {
        if (Math.round(status / 10) === 40) {
            return cli_color.bgXterm(5);
        }
        else {
            return cli_color.bgXterm(9);
        }
    }
    catch(exception, host) {
        var _a, _b;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let errors = [];
        const request = ctx.getRequest();
        const status = 0 + (exception ? exception.getStatus() : 500);
        let errMsg = '';
        const errDecs = exception.getResponse()['error'] || 'Internal error';
        const processTime = exception['processTime'] || '0';
        const context = exception['context'] || '-/-';
        const { rawHeaders, httpVersion, method, socket, url } = request;
        const { remoteAddress, remoteFamily } = socket;
        const systemError = [];
        if (exception instanceof paramValidationException_1.ParamValidationException) {
            exception.getResponse()['errors'].forEach((ele) => {
                systemError.push({
                    domain: 'url',
                    value: `${url}`,
                    message: `${ele}`,
                });
            });
        }
        else if (exception instanceof validationException_1.ValidationException) {
            errors = (_b = (_a = exception.getResponse()) === null || _a === void 0 ? void 0 : _a['errors']) !== null && _b !== void 0 ? _b : [];
        }
        else if (exception instanceof customInternalServerException_1.CustomInternalServerException) {
            errMsg = 'Failed. Please try again!';
            systemError.push({
                domain: 'url',
                value: `${url}`,
                message: `${errMsg}`,
            });
            this.serverErrorLog.error({
                remoteIP: `${remoteAddress}`,
                method: `${method}`,
                processTime: `${processTime}`,
                statusCode: status,
                url: `${url}`,
                context: `${context}`,
                message: `{"raw_message": "${exception.message}", "response": ${JSON.stringify(exception.getResponse())}}`,
                reqBody: `reqBody: ${JSON.stringify(request.body)}`,
                queryBody: `queryBody: ${JSON.stringify(request.query)}`,
            });
        }
        else {
            errMsg = exception.message || 'Internal error';
            systemError.push({
                domain: 'url',
                value: `${url}`,
                message: `${errMsg}`,
            });
        }
        this.logger.error({
            remoteIP: `${remoteAddress}`,
            method: `${method}`,
            processTime: `${processTime}`,
            statusCode: status,
            url: `${url}`,
            context: `${context}`,
            message: `${JSON.stringify(exception.getResponse())}`,
            reqBody: `reqBody: ${JSON.stringify(request.body)}`,
            queryBody: `queryBody: ${JSON.stringify(request.query)}`,
        });
        const payload = {
            nonce: Date.now(),
            message: `error`,
            status: status,
            error: {
                fields: {
                    count: errors.length,
                    errors: errors,
                },
                systems: {
                    count: systemError.length,
                    errors: systemError,
                },
            },
            payload: {
                count: 0,
                items: [],
            },
        };
        response.status(status).json(payload);
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [])
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map