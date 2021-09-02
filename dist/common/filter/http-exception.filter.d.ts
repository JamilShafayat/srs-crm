import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    private readonly serverErrorLog;
    private getErrorBGC;
    constructor();
    catch(exception: HttpException, host: ArgumentsHost): void;
}
