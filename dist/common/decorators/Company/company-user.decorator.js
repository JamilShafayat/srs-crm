"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUser = void 0;
const common_1 = require("@nestjs/common");
exports.CompanyUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request._user', request._user);
    return request._user;
});
//# sourceMappingURL=company-user.decorator.js.map