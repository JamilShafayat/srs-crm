"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResultDto = void 0;
const openapi = require("@nestjs/swagger");
class PaginatedResultDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { limit: { required: true, type: () => Number }, page: { required: true, type: () => Number }, totalCount: { required: true, type: () => Number }, data: { required: true } };
    }
}
exports.PaginatedResultDto = PaginatedResultDto;
//# sourceMappingURL=PaginatedResult.dto.js.map