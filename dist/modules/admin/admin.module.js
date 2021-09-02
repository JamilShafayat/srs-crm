"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = exports.AdminModuleList = void 0;
const common_1 = require("@nestjs/common");
const file_upload_module_1 = require("../../file-upload/file-upload.module");
const auth_module_1 = require("./auth/auth.module");
const text_module_1 = require("./testPart/text.module");
const users_module_1 = require("./users/users.module");
exports.AdminModuleList = [
    auth_module_1.AdminAuthModule,
    users_module_1.UsersModule,
    file_upload_module_1.FileUploadModule,
    text_module_1.TestsModule,
];
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: exports.AdminModuleList,
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map