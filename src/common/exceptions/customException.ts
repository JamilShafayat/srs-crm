import { HttpException } from '@nestjs/common';
import { CustomInternalServerException } from './customInternalServerException';
import { ParamValidationException } from './paramValidationException';
import { ValidationException } from './validationException';

export class CustomException extends HttpException {
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