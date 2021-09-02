"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = require("@nestjs/swagger");
class BaseDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, isDelete: { required: true, type: () => Boolean }, createBy: { required: true, type: () => Number, nullable: true }, createAt: { required: true, type: () => Date, nullable: true }, updateBy: { required: true, type: () => Number, nullable: true }, updateAt: { required: true, type: () => Date, nullable: true } };
    }
}
exports.default = BaseDTO;
//# sourceMappingURL=base.dto.js.map