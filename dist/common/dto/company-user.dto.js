"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUserDto = void 0;
const openapi = require("@nestjs/swagger");
class CompanyUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, user_type: { required: true, type: () => String }, company_id: { required: true, type: () => String } };
    }
}
exports.CompanyUserDto = CompanyUserDto;
//# sourceMappingURL=company-user.dto.js.map