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
exports.AdminAuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bcrypt = require("bcrypt");
const payload_response_dto_1 = require("../../../../common/dto/payload-response.dto");
const dtoValidation_pipe_1 = require("../../../../common/pipes/dtoValidation.pipe");
const auth_dto_1 = require("../dto/auth.dto");
const auth_service_1 = require("../services/auth.service");
let AdminAuthController = class AdminAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async auth(authData) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('123456', salt);
        const auth = await this.authService.auth(authData);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Successfully logged in',
            data: { auth },
        });
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, swagger_1.ApiResponse)({
        description: 'Successfully logged in.',
        status: common_1.HttpStatus.OK,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Validation error' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Invalid credentials / inactive' }),
    (0, swagger_1.ApiInternalServerErrorResponse)({ description: 'Internal Server Error.' }),
    (0, swagger_1.ApiBody)({ type: auth_dto_1.AdminAuthDto }),
    openapi.ApiResponse({ status: 201, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AdminAuthDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "auth", null);
AdminAuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('v1/admin/auth'),
    __metadata("design:paramtypes", [auth_service_1.AdminAuthService])
], AdminAuthController);
exports.AdminAuthController = AdminAuthController;
//# sourceMappingURL=auth.controller.js.map