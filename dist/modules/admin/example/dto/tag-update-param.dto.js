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
exports.TagUpdateParamDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const string_to_numeric_transformer_1 = require("../../../../common/dto/transformer/string-to-numeric.transformer");
class TagUpdateParamDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { exampleId: { required: true, type: () => Number }, tagId: { required: true, type: () => Number, minimum: 1 } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(string_to_numeric_transformer_1.default),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TagUpdateParamDto.prototype, "exampleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)(string_to_numeric_transformer_1.default),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TagUpdateParamDto.prototype, "tagId", void 0);
exports.TagUpdateParamDto = TagUpdateParamDto;
//# sourceMappingURL=tag-update-param.dto.js.map