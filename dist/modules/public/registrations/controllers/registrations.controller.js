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
exports.RegistrationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payload_response_dto_1 = require("../../../../common/dto/payload-response.dto");
const dtoValidation_pipe_1 = require("../../../../common/pipes/dtoValidation.pipe");
const typeorm_1 = require("typeorm");
const registrations_dto_1 = require("../dto/registrations.dto");
const registrations_service_1 = require("../services/registrations.service");
let RegistrationsController = class RegistrationsController {
    constructor(registrationService) {
        this.registrationService = registrationService;
    }
    async create(registrationDto, manager) {
        const user = await this.registrationService.create(registrationDto);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Registrated Successfull',
            data: { user },
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ description: 'User Registration', status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiBody)({ type: registrations_dto_1.RegistrationDto }),
    openapi.ApiResponse({ status: 201, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(1, (0, typeorm_1.TransactionManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrations_dto_1.RegistrationDto,
        typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], RegistrationsController.prototype, "create", null);
RegistrationsController = __decorate([
    (0, common_1.Controller)('v1/public/registrations'),
    (0, swagger_1.ApiTags)('User Registration'),
    __metadata("design:paramtypes", [registrations_service_1.RegistrationService])
], RegistrationsController);
exports.RegistrationsController = RegistrationsController;
//# sourceMappingURL=registrations.controller.js.map