import { HttpException } from '@nestjs/common';
import { CustomInternalServerException } from './customInternalServerException';
import { ParamValidationException } from './paramValidationException';
import { ValidationException } from './validationException';

export class CustomException extends HttpException {
  /**
   * Instantiate a `CustomInternalServerException` Exception.
   *
   * @example
   * //using in service
   * `try{
   *    // throw new HttpException('Try Again!',HttpStatus.BAD_REQUEST)
   *    // throw new BadRequestException('Bad request')
   *    // throw new ForbiddenException('Access dined')
   *    throw new ValidationException([{
   *          field: 'slug',
   *          message: "Slug already exist. "
   *    }])
   * }catch(error){
   *   throw new CustomException(error);
   * }
   * `
   *
   */
  constructor(error) {
    if (error instanceof HttpException === false) {
      throw new CustomInternalServerException(error);
    } else if (error instanceof ValidationException) {
      throw error;
    } else if (error instanceof ParamValidationException) {
      throw error;
    }
    super(error, error.status);
  }
}
