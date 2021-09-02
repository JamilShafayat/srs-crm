import { HttpException } from '@nestjs/common';
export interface IValidationError {
    field: string;
    message: string;
}
export declare class ParamValidationException extends HttpException {
    constructor(errors: string[]);
}
