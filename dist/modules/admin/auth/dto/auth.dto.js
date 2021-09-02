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
exports.AdminAuthDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AdminAuthDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { identifier: { required: true, type: () => String, minLength: 10, maxLength: 200 }, password: { required: true, type: () => String, minLength: 6, maxLength: 200 } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Login identifier',
        default: '01711033730',
    }),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminAuthDto.prototype, "identifier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'User Password',
        default: '123456',
    }),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminAuthDto.prototype, "password", void 0);
exports.AdminAuthDto = AdminAuthDto;
//# sourceMappingURL=auth.dto.js.map