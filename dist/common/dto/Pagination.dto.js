"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
const openapi = require("@nestjs/swagger");
class PaginationDto {
    constructor(obj) {
        const { page = '1', limit } = obj;
        this.page = parseInt('' + page) || 1;
        if (this.page < 1)
            this.page = 1;
        this.limit = parseInt('' + limit) || 10;
        this.skip = (this.page - 1) * this.limit;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, skip: { required: true, type: () => Number } };
    }
}
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=Pagination.dto.js.map