"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const config_1 = require("../../configs/config");
let AuthGuard = class AuthGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        try {
            const authorizationHeader = req.headers['authorization'];
            let token;
            if (authorizationHeader) {
                token = authorizationHeader.split(' ')[1];
            }
            if (token) {
                const jwtDecode = jwt.verify(token, config_1.ADMIN_JWT_SECRET);
                req['_user'] = jwtDecode;
                return true;
            }
            else {
                throw new common_1.UnauthorizedException('No token provided');
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Authentication failed. Please Try again! Now');
        }
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)()
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map