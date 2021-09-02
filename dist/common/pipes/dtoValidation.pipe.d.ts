import { ArgumentMetadata, PipeTransform, ValidationPipeOptions } from '@nestjs/common';
export declare class DtoValidationPipe implements PipeTransform<any> {
    options: ValidationPipeOptions;
    constructor(options?: ValidationPipeOptions);
    transform(value: any, { metatype, type }: ArgumentMetadata): Promise<any>;
    private toValidate;
    private findChildError;
}
