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
exports.TagStoreDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const media_store_dto_1 = require("./media-store.dto");
class TagStoreDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { tagName: { required: true, type: () => String, minLength: 3, maxLength: 200 }, tagSlug: { required: true, type: () => String, minLength: 3, maxLength: 250 }, media: { required: true, type: () => [require("./media-store.dto").MediaStoreDto] } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MaxLength)(200),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TagStoreDTO.prototype, "tagName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.MaxLength)(250),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TagStoreDTO.prototype, "tagSlug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [media_store_dto_1.MediaStoreDto] }),
    (0, class_transformer_1.Type)(() => media_store_dto_1.MediaStoreDto),
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], TagStoreDTO.prototype, "media", void 0);
exports.TagStoreDTO = TagStoreDTO;
//# sourceMappingURL=tag-store.dto.js.map