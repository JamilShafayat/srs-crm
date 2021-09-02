"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserDto = void 0;
const openapi = require("@nestjs/swagger");
class AdminUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, user_type: { required: true, type: () => String } };
    }
}
exports.AdminUserDto = AdminUserDto;
//# sourceMappingURL=admin-user.dto.js.map