"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../../common/entities/admin/users/user.entity");
const mail_module_1 = require("../../mail/mail.module");
const registrations_controller_1 = require("./controllers/registrations.controller");
const registrations_service_1 = require("./services/registrations.service");
let RegistrationsModule = class RegistrationsModule {
};
RegistrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.AdminUserEntity]), mail_module_1.MailModule],
        controllers: [registrations_controller_1.RegistrationsController],
        providers: [registrations_service_1.RegistrationService],
    })
], RegistrationsModule);
exports.RegistrationsModule = RegistrationsModule;
//# sourceMappingURL=registrations.module.js.map