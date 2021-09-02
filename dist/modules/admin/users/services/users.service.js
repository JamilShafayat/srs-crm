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
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const admin_user_dto_1 = require("../../../../common/dto/admin-user.dto");
const Pagination_dto_1 = require("../../../../common/dto/Pagination.dto");
const user_entity_1 = require("../../../../common/entities/admin/users/user.entity");
const customException_1 = require("../../../../common/exceptions/customException");
const validationException_1 = require("../../../../common/exceptions/validationException");
const typeorm_2 = require("typeorm");
let AdminUsersService = class AdminUsersService {
    constructor(adminUserRepository, connection) {
        this.adminUserRepository = adminUserRepository;
        this.connection = connection;
    }
    async findAll(filter, pagination) {
        try {
            const whereCondition = {};
            if (filter.status) {
                whereCondition['status'] = (0, typeorm_2.Equal)(filter.status);
            }
            if (filter.phone) {
                whereCondition['phone'] = (0, typeorm_2.Equal)(filter.phone);
            }
            const users = await this.adminUserRepository.find({
                where: Object.assign({}, whereCondition),
                order: { created_by: 'DESC' },
                skip: pagination.skip,
                take: pagination.limit,
            });
            const total = await this.adminUserRepository.count({
                where: Object.assign({}, whereCondition),
            });
            return [users, total];
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async create(createAdminUserDto, adminUser) {
        try {
            const { full_name, phone, password, user_type } = createAdminUserDto;
            const findExisting = await this.adminUserRepository.findOne({ phone });
            if (findExisting) {
                throw new validationException_1.ValidationException([
                    {
                        field: 'phone',
                        message: 'User Already  Exists.',
                    },
                ]);
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const data = {
                full_name,
                phone,
                user_type,
                password: hashedPassword,
                created_by: adminUser.id,
            };
            const addedUserData = await this.adminUserRepository.save(data);
            return addedUserData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async findAllList() {
        try {
            const expectedData = await this.adminUserRepository.findAndCount({
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
            const expectedData = await this.adminUserRepository.findOne({
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
    async update(id, updateAdminUserDto, adminUser) {
        try {
            const whereCondition = {};
            whereCondition['phone'] = (0, typeorm_2.Equal)(updateAdminUserDto.phone);
            whereCondition['id'] = (0, typeorm_2.Not)((0, typeorm_2.Equal)(id));
            const udEexpectedData = await this.adminUserRepository.findOne({
                where: Object.assign({}, whereCondition),
            });
            if (udEexpectedData) {
                throw new validationException_1.ValidationException([
                    {
                        field: 'phone',
                        message: 'Phone Number Already  Exists with another User.',
                    },
                ]);
            }
            await this.adminUserRepository.update({
                id: id,
            }, {
                full_name: updateAdminUserDto.full_name,
                phone: updateAdminUserDto.phone,
                updated_by: adminUser.id,
            });
            const user = await this.adminUserRepository.findOne(id);
            return user;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async status(id, statusChangeAdminUserDto, adminUser) {
        try {
            const expectedData = await this.adminUserRepository.findOne(id);
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            await this.adminUserRepository.update({
                id: id,
            }, {
                status: statusChangeAdminUserDto.status,
                updated_by: adminUser.id,
            });
            const user = await this.adminUserRepository.findOne(id);
            return user;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async remove(id, adminUser) {
        try {
            const expectedData = await this.adminUserRepository.findOne({ id: id });
            if (!expectedData) {
                throw new common_1.NotFoundException('No User Found!');
            }
            await this.connection.transaction(async (manager) => {
                await manager.getRepository('admin_users').update({
                    id: id,
                }, {
                    deleted_by: adminUser.id,
                });
                await manager
                    .getRepository('admin_users')
                    .softDelete(id);
                return true;
            });
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async finalDelete(id) {
        try {
            const expectedData = await this.adminUserRepository.find({
                where: { id },
                withDeleted: true,
            });
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            await this.adminUserRepository.delete(id);
            return true;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
};
AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.AdminUserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Connection])
], AdminUsersService);
exports.AdminUsersService = AdminUsersService;
//# sourceMappingURL=users.service.js.map