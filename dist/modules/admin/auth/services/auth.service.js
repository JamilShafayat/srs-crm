"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const typeorm_2 = require("typeorm");
const config_1 = require("../../../../common/configs/config");
const user_entity_1 = require("../../../../common/entities/admin/users/user.entity");
const customException_1 = require("../../../../common/exceptions/customException");
let AdminAuthService = class AdminAuthService {
    constructor(adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }
    async auth(auth) {
        try {
            const user = await this.adminUserRepository.findOne({
                phone: auth.identifier,
            });
            if (!user)
                throw new common_1.ForbiddenException('Invalid Credentials');
            if (user.status === 0)
                throw new common_1.ForbiddenException('You are inactive, please contact with admin');
            const match = await bcrypt.compare(auth.password, user.password);
            if (!match)
                throw new common_1.ForbiddenException('Invalid Credentials');
            const token = this.login(user);
            const user_id = user.id;
            return {
                user_id,
                userType: user.user_type,
                token,
            };
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    login(user) {
        const payload = { id: user.id, user_type: user.user_type };
        return jwt.sign(payload, config_1.ADMIN_JWT_SECRET);
    }
};
AdminAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.AdminUserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminAuthService);
exports.AdminAuthService = AdminAuthService;
//# sourceMappingURL=auth.service.js.map