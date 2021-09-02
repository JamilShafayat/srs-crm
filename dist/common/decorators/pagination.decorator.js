"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const common_1 = require("@nestjs/common");
exports.Pagination = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10 } = request.query;
    let pageNo = parseInt('' + page) || 1;
    if (pageNo < 1)
        pageNo = 1;
    const limitData = parseInt('' + limit) || 10;
    const skip = (pageNo - 1) * limitData;
    return {
        page: pageNo,
        limit: limitData,
        skip: skip,
    };
});
//# sourceMappingURL=pagination.decorator.js.map