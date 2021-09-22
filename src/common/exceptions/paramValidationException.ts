import { HttpException, HttpStatus } from '@nestjs/common';

export interface IValidationError {
	field: string;
	message: string;
}

export class ParamValidationException extends HttpException {
	constructor(errors: string[]) {
		super({ errors }, HttpStatus.BAD_REQUEST);
	}
}
