import { HttpException } from '@nestjs/common';
export interface IValidationError {
    field: string;
    message: string;
}
export declare class ValidationException extends HttpException {
    constructor(errors: IValidationError[]);
}
