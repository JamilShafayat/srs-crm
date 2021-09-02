import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import * as cli_color from 'cli-color';
import { Request, Response } from 'express';
import * as winston from 'winston';
import { CustomInternalServerException } from '../exceptions/customInternalServerException';
import { ParamValidationException } from '../exceptions/paramValidationException';
import { ValidationException } from '../exceptions/validationException';
import { IPayloadMSG } from '../interfaces/payload-msg.interface';

/**
 * HttpExceptionFilter user for All error payload response format
 *
 * @example add to app.module
 * @date 2020-10-09T12:11:13.305Z
 * @class HttpExceptionFilter
 * @since 1.0.0
 * @version 1.0.0
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * logger variable
   *
   * @date 2020-10-08T12:11:13.305Z
   * @access private
   * @since 1.0.0
   * @name logger
   * @private
   * @constant
   */
  private readonly logger: winston.Logger;
  private readonly serverErrorLog: winston.Logger;

  /**
   * `getErrorBGC` use for background color
   *
   * @date 2020-10-09T12:11:13.305Z
   * @example
   * // returns {cli_color->Object}
   * `this.getErrorBGC(+err.statusCode);`
   *
   * @method getErrorBGC
   * @access private
   * @private
   * @description use for background color
   * @author asraful
   * @version 1.0.0
   * @since 1.0.0
   * @param  {number} status default 500
   * @returns {Object} cli_color Object
   */
  private getErrorBGC(status = 500): any {
    if (Math.round(status / 10) === 40) {
      return cli_color.bgXterm(5);
    } else {
      return cli_color.bgXterm(9);
    }
  }

  /**
   * init logger
   *
   * @constructor
   * @author asraful
   * @since 1.0.0
   * @version 1.0.0
   * @date 2020-10-07T12:11:13.305Z
   */
  constructor() {
    this.serverErrorLog = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'server_error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              (info) =>
                `${info.remoteIP}\t` +
                `[${info.timestamp}] ` +
                `"${info.method} ` +
                `${info.url}\t` +
                `${info.context}"\t` +
                `${info.statusCode} \t` +
                `${info.processTime + 'ms'} ` +
                `${info.reqBody} \t` +
                `${info.queryBody} \t` +
                `${info.message}`,
            ),
          ),
        }),
      ],
    });
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf((err) => {
              const statusCoror = this.getErrorBGC(+err.statusCode);
              const str = statusCoror(
                //`${greenBright}` +
                `${cli_color.blueBright(err.remoteIP)} ` +
                  `[${cli_color.greenBright(err.timestamp)}] ` +
                  `${cli_color.yellowBright(err.context)} ` +
                  `${cli_color.cyanBright(err.method)} ` +
                  `"${err.url}" ` +
                  `${cli_color.magentaBright(err.statusCode)} ` +
                  `${cli_color.yellow(err.processTime + 'ms')} ` +
                  `${err.message.substring(0, 10) + '...'}`,
              );
              return `${str}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
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
                `${info.reqBody} \t` +
                `${info.queryBody} \t` +
                `${info.message}`,
            ),
          ),
        }),
      ],
    });
  }

  /**
   * `catch` override method
   *
   * @date 2020-10-08T12:11:13.305Z
   * @since 1.0.0
   * @version 1.0.0
   * @override
   * @param  {HttpException} exception
   * @param  {ArgumentsHost} host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errors = [];
    const request = ctx.getRequest<Request>();
    const status = 0 + (exception ? exception.getStatus() : 500);
    let errMsg = '';
    const errDecs = exception.getResponse()['error'] || 'Internal error';
    const processTime = exception['processTime'] || '0';
    const context = exception['context'] || '-/-';
    const { rawHeaders, httpVersion, method, socket, url } = request;
    const { remoteAddress, remoteFamily } = socket;
    const systemError = [];
    if (exception instanceof ParamValidationException) {
      exception.getResponse()['errors'].forEach((ele) => {
        systemError.push({
          domain: 'url',
          value: `${url}`,
          message: `${ele}`,
        });
      });
    } else if (exception instanceof ValidationException) {
      errors = exception.getResponse()?.['errors'] ?? [];
    } else if (exception instanceof CustomInternalServerException) {
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
        message: `{"raw_message": "${
          exception.message
        }", "response": ${JSON.stringify(exception.getResponse())}}`,
        reqBody: `reqBody: ${JSON.stringify(request.body)}`,
        queryBody: `queryBody: ${JSON.stringify(request.query)}`,
      });
    } else {
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
    const payload: IPayloadMSG = {
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
}
