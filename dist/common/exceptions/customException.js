"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomException = void 0;
const common_1 = require("@nestjs/common");
const customInternalServerException_1 = require("./customInternalServerException");
const paramValidationException_1 = require("./paramValidationException");
const validationException_1 = require("./validationException");
class CustomException extends common_1.HttpException {
    constructor(error) {
        if (error instanceof common_1.HttpException === false) {
            throw new customInternalServerException_1.CustomInternalServerException(error);
        }
        else if (error instanceof validationException_1.ValidationException) {
            throw error;
        }
        else if (error instanceof paramValidationException_1.ParamValidationException) {
            throw error;
        }
        super(error, error.status);
    }
}
exports.CustomException = CustomException;
//# sourceMappingURL=customException.js.map