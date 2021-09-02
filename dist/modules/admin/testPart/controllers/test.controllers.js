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
exports.TestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_user_decorator_1 = require("../../../../common/decorators/Admin/admin-user.decorator");
const pagination_decorator_1 = require("../../../../common/decorators/pagination.decorator");
const admin_user_dto_1 = require("../../../../common/dto/admin-user.dto");
const Pagination_dto_1 = require("../../../../common/dto/Pagination.dto");
const payload_response_dto_1 = require("../../../../common/dto/payload-response.dto");
const auth_guard_1 = require("../../../../common/guard/admin/auth.guard");
const dtoValidation_pipe_1 = require("../../../../common/pipes/dtoValidation.pipe");
const typeorm_1 = require("typeorm");
const create_test_dto_1 = require("../dto/create-test.dto");
const status_change_test_dto_1 = require("../dto/status-change-test.dto");
const test_id_param_dto_1 = require("../dto/test-id-param.dto");
const test_list_dto_1 = require("../dto/test-list.dto");
const update_test_dto_1 = require("../dto/update-test-dto");
const test_service_1 = require("../services/test.service");
let TestsController = class TestsController {
    constructor(testService) {
        this.testService = testService;
    }
    async findAll(filter, pagination) {
        const [tests, total] = await this.testService.findAll(filter, pagination);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'All tests Fetched',
            metadata: {
                page: pagination.page,
                totalCount: total,
                limit: pagination.limit,
            },
            data: { tests },
        });
    }
    async create(adminUser, createTestDto, manager) {
        const test = await this.testService.create(createTestDto, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Test Entry Successful',
            data: { test },
        });
    }
    async findAllList() {
        const [tests] = await this.testService.findAllList();
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'All Active Tests Fetched',
            data: { tests },
        });
    }
    async findOne(params) {
        const test = await this.testService.findOne(params.id);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Single Test Fetched',
            data: { test },
        });
    }
    async update(adminUser, params, updateTestDto) {
        const test = await this.testService.update(params.id, updateTestDto, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Data Updated',
            data: { test },
        });
    }
    async status(adminUser, params, statusChangeTestDto) {
        const test = await this.testService.status(params.id, statusChangeTestDto, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'test Updated',
            data: { test },
        });
    }
    async remove(adminUser, params) {
        await this.testService.remove(params.id, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Data Soft Deleted',
            data: {},
        });
    }
    async finalDelete(params) {
        await this.testService.finalDelete(params.id);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Data Completely Deleted',
            data: {},
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ description: 'Get All Tets', status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_list_dto_1.TestListDto,
        Pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ description: 'Test Add', status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiBody)({ type: create_test_dto_1.CreateTestDto }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, typeorm_1.TransactionManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        create_test_dto_1.CreateTestDto,
        typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/list'),
    (0, swagger_1.ApiResponse)({ description: 'Get Only Active Tests', status: common_1.HttpStatus.OK }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "findAllList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'Single Test Fetched', status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_id_param_dto_1.TestIdParamDto]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'Single Test Fetched', status: common_1.HttpStatus.OK }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        test_id_param_dto_1.TestIdParamDto,
        update_test_dto_1.UpdateTestDto]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiResponse)({
        description: 'Single Test Status Changed',
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        test_id_param_dto_1.TestIdParamDto,
        status_change_test_dto_1.StatusChangeTestDto]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "status", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'Single Test Deleted', status: common_1.HttpStatus.OK }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        test_id_param_dto_1.TestIdParamDto]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('/:id/delete'),
    __param(0, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [test_id_param_dto_1.TestIdParamDto]),
    __metadata("design:returntype", Promise)
], TestsController.prototype, "finalDelete", null);
TestsController = __decorate([
    (0, common_1.Controller)('v1/admin/tests'),
    (0, swagger_1.ApiTags)('Tests'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid Credential' }),
    __metadata("design:paramtypes", [test_service_1.TestsService])
], TestsController);
exports.TestsController = TestsController;
//# sourceMappingURL=test.controllers.js.map