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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
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
const admin_user_id_param_dto_1 = require("../dto/admin-user-id-param.dto");
const admin_user_list_dto_1 = require("../dto/admin-user-list.dto");
const create_user_dto_1 = require("../dto/create-user.dto");
const status_change_user_dto_1 = require("../dto/status-change-user.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const users_service_1 = require("../services/users.service");
let UsersController = class UsersController {
    constructor(adminUsersService) {
        this.adminUsersService = adminUsersService;
    }
    async findAll(filter, pagination) {
        const [users, total] = await this.adminUsersService.findAll(filter, pagination);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'All users Fetched',
            metadata: {
                page: pagination.page,
                totalCount: total,
                limit: pagination.limit,
            },
            data: { users },
        });
    }
    async create(adminUser, createAdminUserDto, manager) {
        console.log(createAdminUserDto);
        const user = await this.adminUsersService.create(createAdminUserDto, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'User Entry Successful',
            data: { user },
        });
    }
    async findAllList() {
        const [user] = await this.adminUsersService.findAllList();
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'All Active user Fetched',
            data: { user },
        });
    }
    async findOne(params) {
        const user = await this.adminUsersService.findOne(params.id);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Single user Fetched',
            data: { user },
        });
    }
    async update(adminUser, params, updateAdminUserDto) {
        const user = await this.adminUsersService.update(params.id, updateAdminUserDto, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Data Updated',
            data: { user },
        });
    }
    async status(adminUser, params, statusChangeAdminUserDto) {
        const user = await this.adminUsersService.status(params.id, statusChangeAdminUserDto, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'user Updated',
            data: { user },
        });
    }
    async remove(adminUser, params) {
        await this.adminUsersService.remove(params.id, adminUser);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Data Soft Deleted',
            data: {},
        });
    }
    async finalDelete(params) {
        await this.adminUsersService.finalDelete(params.id);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: 'Data Completely Deleted',
            data: {},
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ description: 'Get All Users', status: common_1.HttpStatus.OK }),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_list_dto_1.AdminUserListDto,
        Pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ description: 'Admin User Add', status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateAdminUserDto }),
    openapi.ApiResponse({ status: 201, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, typeorm_1.TransactionManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        create_user_dto_1.CreateAdminUserDto,
        typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/list'),
    (0, swagger_1.ApiResponse)({ description: 'Get Only Active Users', status: common_1.HttpStatus.OK }),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllList", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'Single User Fetched', status: common_1.HttpStatus.OK }),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_id_param_dto_1.AdminUserIdParamDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'Single User Fetched', status: common_1.HttpStatus.OK }),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        admin_user_id_param_dto_1.AdminUserIdParamDto,
        update_user_dto_1.UpdateAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiResponse)({
        description: 'Single User Status Changed',
        status: common_1.HttpStatus.OK,
    }),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        admin_user_id_param_dto_1.AdminUserIdParamDto,
        status_change_user_dto_1.StatusChangeAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "status", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'Single User Deleted', status: common_1.HttpStatus.OK }),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        admin_user_id_param_dto_1.AdminUserIdParamDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('/:id/delete'),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_id_param_dto_1.AdminUserIdParamDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "finalDelete", null);
UsersController = __decorate([
    (0, common_1.Controller)('v1/admin/users'),
    (0, swagger_1.ApiTags)('Admin Users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid Credential' }),
    __metadata("design:paramtypes", [users_service_1.AdminUsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map