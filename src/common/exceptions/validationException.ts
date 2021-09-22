import { HttpException, HttpStatus } from '@nestjs/common';

export interface IValidationError {
	field?: string;
	message: string;
}

export class ValidationException extends HttpException {
	constructor(errors: IValidationError[]) {
		super({ errors }, HttpStatus.BAD_REQUEST);
	}
}
