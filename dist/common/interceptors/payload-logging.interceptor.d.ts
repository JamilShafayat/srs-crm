import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class PayloadLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    constructor();
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
