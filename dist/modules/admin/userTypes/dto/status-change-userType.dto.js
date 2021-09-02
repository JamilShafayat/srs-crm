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
exports.StatusChangeUserTypeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const status_enum_1 = require("../../../../common/enums/status/status.enum");
class StatusChangeUserTypeDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'User Type Status', default: status_enum_1.StatusTypeEnum.ACTIVE }),
    (0, class_validator_1.IsEnum)(status_enum_1.StatusTypeEnum, { message: "Status Should be 0 or 1" }),
    __metadata("design:type", Number)
], StatusChangeUserTypeDto.prototype, "status", void 0);
exports.StatusChangeUserTypeDto = StatusChangeUserTypeDto;
//# sourceMappingURL=status-change-userType.dto.js.map