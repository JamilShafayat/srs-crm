import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class DataTransformGlobalPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    arrayTrim(items: any): any;
    objectTrim(obj: any): any;
    trimSubItem(obj: any, ele: any): void;
}
