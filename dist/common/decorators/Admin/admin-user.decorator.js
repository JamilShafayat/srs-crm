"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUser = void 0;
const common_1 = require("@nestjs/common");
exports.AdminUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('request._user', request._user);
    return request._user;
});
//# sourceMappingURL=admin-user.decorator.js.map