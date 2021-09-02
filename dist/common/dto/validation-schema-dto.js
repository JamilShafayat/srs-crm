"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationSchemaDto {
    constructor({ body, query, param, }) {
        if (body) {
            this.body = body;
        }
        if (query) {
            this.query = query;
        }
        if (param) {
            this.param = param;
        }
    }
}
exports.default = ValidationSchemaDto;
//# sourceMappingURL=validation-schema-dto.js.map