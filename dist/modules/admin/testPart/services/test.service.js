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
exports.TestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_user_dto_1 = require("../../../../common/dto/admin-user.dto");
const Pagination_dto_1 = require("../../../../common/dto/Pagination.dto");
const test_entity_1 = require("../../../../common/entities/admin/test/test.entity");
const customException_1 = require("../../../../common/exceptions/customException");
const typeorm_2 = require("typeorm");
let TestsService = class TestsService {
    constructor(testRepository, connection) {
        this.testRepository = testRepository;
        this.connection = connection;
    }
    async findAll(filter, pagination) {
        try {
            const whereCondition = {};
            if (filter.status) {
                whereCondition['status'] = (0, typeorm_2.Equal)(filter.status);
            }
            const users = await this.testRepository.find({
                where: Object.assign({}, whereCondition),
                order: { created_by: 'DESC' },
                skip: pagination.skip,
                take: pagination.limit,
            });
            const total = await this.testRepository.count({
                where: Object.assign({}, whereCondition),
            });
            return [users, total];
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async create(createTestDto, test) {
        try {
            const { name, type } = createTestDto;
            const data = {
                name,
                type,
                created_by: test.id,
            };
            const addedTestData = await this.testRepository.save(data);
            return addedTestData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async findAllList() {
        try {
            const expectedData = await this.testRepository.findAndCount({
                status: 1,
            });
            return expectedData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async findOne(id) {
        try {
            const expectedData = await this.testRepository.findOne({
                where: { id },
            });
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            return expectedData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async update(id, updateTestDto, test) {
        try {
            await this.testRepository.update({
                id: id,
            }, {
                name: updateTestDto.name,
                type: updateTestDto.type,
                updated_by: test.id,
            });
            const testData = await this.testRepository.findOne(id);
            return testData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async status(id, statusChangeTestDto, adminUser) {
        try {
            const expectedData = await this.testRepository.findOne(id);
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            await this.testRepository.update({
                id: id,
            }, {
                status: statusChangeTestDto.status,
                updated_by: adminUser.id,
            });
            const test = await this.testRepository.findOne(id);
            return test;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async remove(id, adminUser) {
        try {
            const expectedData = await this.testRepository.findOne({ id: id });
            if (!expectedData) {
                throw new common_1.NotFoundException('No Test Found!');
            }
            await this.connection.transaction(async (manager) => {
                await manager.getRepository('admin_users').update({
                    id: id,
                }, {
                    deleted_by: adminUser.id,
                });
                await manager.getRepository('admin_users').softDelete(id);
                return true;
            });
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async finalDelete(id) {
        try {
            const expectedData = await this.testRepository.find({
                where: { id },
                withDeleted: true,
            });
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            await this.testRepository.delete(id);
            return true;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
};
TestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(test_entity_1.TestEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Connection])
], TestsService);
exports.TestsService = TestsService;
//# sourceMappingURL=test.service.js.map