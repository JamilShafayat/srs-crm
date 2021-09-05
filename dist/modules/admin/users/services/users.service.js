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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const admin_user_dto_1 = require("../../../../common/dto/admin-user.dto");
const Pagination_dto_1 = require("../../../../common/dto/Pagination.dto");
const user_entity_1 = require("../../../../common/entities/user.entity");
const customException_1 = require("../../../../common/exceptions/customException");
const validationException_1 = require("../../../../common/exceptions/validationException");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    constructor(userRepository, connection) {
        this.userRepository = userRepository;
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
            const users = await this.userRepository.find({
                where: Object.assign({}, whereCondition),
                order: { created_by: 'DESC' },
                skip: pagination.skip,
                take: pagination.limit,
            });
            const total = await this.userRepository.count({
                where: Object.assign({}, whereCondition),
            });
            return [users, total];
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async create(createUserDto, adminUser) {
        try {
            const { name, phone, password, user_type } = createUserDto;
            const findExisting = await this.userRepository.findOne({ phone });
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
                name,
                phone,
                user_type,
                password: hashedPassword,
                created_by: adminUser.id,
            };
            const addedUserData = await this.userRepository.save(data);
            return addedUserData;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async findAllList() {
        try {
            const expectedData = await this.userRepository.findAndCount({
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
            const expectedData = await this.userRepository.findOne({
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
    async update(id, updateUserDto, adminUser) {
        try {
            const whereCondition = {};
            whereCondition['phone'] = (0, typeorm_2.Equal)(updateUserDto.phone);
            whereCondition['id'] = (0, typeorm_2.Not)((0, typeorm_2.Equal)(id));
            const unEexpectedData = await this.userRepository.findOne({
                where: Object.assign({}, whereCondition),
            });
            if (unEexpectedData) {
                throw new validationException_1.ValidationException([
                    {
                        field: 'phone',
                        message: 'Phone Number Already Exists with another User.',
                    },
                ]);
            }
            await this.userRepository.update({
                id: id,
            }, {
                name: updateUserDto.name,
                phone: updateUserDto.phone,
                updated_by: adminUser.id,
            });
            const user = await this.userRepository.findOne(id);
            return user;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async status(id, statusChangeUserDto, adminUser) {
        try {
            const expectedData = await this.userRepository.findOne(id);
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            await this.userRepository.update({
                id: id,
            }, {
                status: statusChangeUserDto.status,
                updated_by: adminUser.id,
            });
            const user = await this.userRepository.findOne(id);
            return user;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    async remove(id, adminUser) {
        try {
            const expectedData = await this.userRepository.findOne({ id: id });
            if (!expectedData) {
                throw new common_1.NotFoundException('No User Found!');
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
            const expectedData = await this.userRepository.find({
                where: { id },
                withDeleted: true,
            });
            if (!expectedData) {
                throw new common_1.NotFoundException('No Data Found!');
            }
            await this.userRepository.delete(id);
            return true;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Connection])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map