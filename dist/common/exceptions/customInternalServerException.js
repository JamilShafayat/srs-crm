"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomInternalServerException = void 0;
const common_1 = require("@nestjs/common");
class CustomInternalServerException extends common_1.HttpException {
    constructor(error) {
        super(error, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.CustomInternalServerException = CustomInternalServerException;
//# sourceMappingURL=customInternalServerException.js.map