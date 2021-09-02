import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import ValidationSchemaDto from '../dto/validation-schema-dto';
import { CustomInternalServerException } from '../exceptions/customInternalServerException';
import { ParamValidationException } from '../exceptions/paramValidationException';
import {
  IValidationError,
  ValidationException,
} from '../exceptions/validationException';
@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private schema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (this.schema instanceof Yup.ObjectSchema && metadata.type === 'body') {
        await this.schema.validate(value, { abortEarly: false });
      } else if (this.schema instanceof ValidationSchemaDto) {
        const { body = false, query = false, param = false } = this.schema;
        if (metadata.type === 'param' && param) {
          await param.validate(value, { abortEarly: false });
        } else if (metadata.type === 'body' && body) {
          await body.validate(value, { abortEarly: false });
        } else if (metadata.type === 'query' && query) {
          await query.validate(value, { abortEarly: false });
        }
      }
      return value;
    } catch (err) {
      const errors = [];
      if (metadata.type === 'param') {
        throw new ParamValidationException(err.errors);
      } else if (err instanceof ValidationError) {
        err.inner.forEach((err) => {
          const error: IValidationError = {
            field: err.path,
            message: err.message,
          };
          errors.push(error);
        });
        throw new ValidationException(errors);
      } else {
        throw new CustomInternalServerException(err);
      }
    }
  }
}
