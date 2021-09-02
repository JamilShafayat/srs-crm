import { HttpException } from '@nestjs/common';
export declare class CustomInternalServerException extends HttpException {
    constructor(error: any);
}
