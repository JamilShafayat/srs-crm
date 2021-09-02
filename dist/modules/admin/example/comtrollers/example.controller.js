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
exports.ExampleController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const item_store_dto_1 = require("../dto/item-store.dto");
const dtoValidation_pipe_1 = require("../../../../common/pipes/dtoValidation.pipe");
const example_service_1 = require("../services/example.service");
const payload_response_dto_1 = require("../../../../common/dto/payload-response.dto");
const typeorm_1 = require("typeorm");
const tag_store_dto_1 = require("../dto/tag-store.dto");
const tag_update_param_dto_1 = require("../dto/tag-update-param.dto");
const swagger_1 = require("@nestjs/swagger");
const admin_user_decorator_1 = require("../../../../common/decorators/Admin/admin-user.decorator");
const admin_user_dto_1 = require("../../../../common/dto/admin-user.dto");
const get_items_dto_1 = require("../dto/get-items.dto");
const pagination_decorator_1 = require("../../../../common/decorators/pagination.decorator");
const Pagination_dto_1 = require("../../../../common/dto/Pagination.dto");
let ExampleController = class ExampleController {
    constructor(exampleService) {
        this.exampleService = exampleService;
    }
    async getItems(adminUser, query, pagination) {
        await this.exampleService.findAll();
        console.log('Helloo.....');
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: '',
            metadata: {
                page: pagination.page,
                totalCount: 100,
                limit: pagination.limit,
            },
            data: { query, pagination, adminUser }
        });
    }
    async storeItem(adminUser, ItemStoreData, manager) {
        await this.exampleService.itemStore(ItemStoreData, manager);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: '',
            data: { adminUser }
        });
    }
    async tagUpdate(tagStoreData, param, manager) {
        await this.exampleService.tagUpdate(tagStoreData, manager);
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: '',
            data: {}
        });
    }
};
__decorate([
    (0, common_1.Get)('/'),
    openapi.ApiResponse({ status: 200, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, pagination_decorator_1.Pagination)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        get_items_dto_1.GetItemsDTO,
        Pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "getItems", null);
__decorate([
    (0, common_1.Post)('/'),
    (0, swagger_1.ApiResponse)({ description: 'Example Item Create', status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid Credential' }),
    (0, swagger_1.ApiBody)({ type: item_store_dto_1.ItemStoreDTO }),
    openapi.ApiResponse({ status: 201, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, admin_user_decorator_1.AdminUser)()),
    __param(1, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, typeorm_1.TransactionManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_user_dto_1.AdminUserDto,
        item_store_dto_1.ItemStoreDTO,
        typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "storeItem", null);
__decorate([
    (0, common_1.Post)('/:exampleId/:tagId'),
    (0, swagger_1.ApiResponse)({ description: 'Example Tag Updated', status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiResponse)({ description: 'Validation Error', status: common_1.HttpStatus.BAD_REQUEST }),
    openapi.ApiResponse({ status: 201, type: require("../../../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.Body)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(1, (0, common_1.Param)(new dtoValidation_pipe_1.DtoValidationPipe())),
    __param(2, (0, typeorm_1.TransactionManager)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tag_store_dto_1.TagStoreDTO, tag_update_param_dto_1.TagUpdateParamDto, typeorm_1.EntityManager]),
    __metadata("design:returntype", Promise)
], ExampleController.prototype, "tagUpdate", null);
ExampleController = __decorate([
    (0, common_1.Controller)('v1/admin/example'),
    (0, swagger_1.ApiTags)('Example'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [example_service_1.ExampleService])
], ExampleController);
exports.ExampleController = ExampleController;
//# sourceMappingURL=example.controller.js.map