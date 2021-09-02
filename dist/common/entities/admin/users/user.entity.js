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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserEntity = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_type_enum_1 = require("../../../enums/admin/user-type.enum");
const common_entity_1 = require("../../common.entity");
const designation_entity_1 = require("../designation/designation.entity");
let AdminUserEntity = class AdminUserEntity extends common_entity_1.CommonEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { full_name: { required: true, type: () => String }, phone: { required: true, type: () => String }, password: { required: true, type: () => String }, designation_id: { required: true, type: () => String }, designation_info: { required: true, type: () => require("../designation/designation.entity").DesignationEntity }, user_type: { required: true, type: () => String } };
    }
};
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AdminUserEntity.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], AdminUserEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AdminUserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AdminUserEntity.prototype, "designation_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => designation_entity_1.DesignationEntity, (designation) => designation.id),
    (0, typeorm_1.JoinColumn)({ name: 'designation_id' }),
    __metadata("design:type", designation_entity_1.DesignationEntity)
], AdminUserEntity.prototype, "designation_info", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_type_enum_1.UserTypeEnum,
        default: user_type_enum_1.UserTypeEnum.GENERAL_USER,
    }),
    __metadata("design:type", String)
], AdminUserEntity.prototype, "user_type", void 0);
AdminUserEntity = __decorate([
    (0, typeorm_1.Entity)('admin_users')
], AdminUserEntity);
exports.AdminUserEntity = AdminUserEntity;
//# sourceMappingURL=user.entity.js.map