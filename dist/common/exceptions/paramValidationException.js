"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamValidationException = void 0;
const common_1 = require("@nestjs/common");
class ParamValidationException extends common_1.HttpException {
    constructor(errors) {
        super({ errors }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ParamValidationException = ParamValidationException;
//# sourceMappingURL=paramValidationException.js.map