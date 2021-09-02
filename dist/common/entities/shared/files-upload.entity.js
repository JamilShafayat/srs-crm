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
exports.FileUploadEntity = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const common_entity_1 = require("../common.entity");
let FileUploadEntity = class FileUploadEntity extends common_entity_1.CommonEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { file_name: { required: true, type: () => String } };
    }
};
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], FileUploadEntity.prototype, "file_name", void 0);
FileUploadEntity = __decorate([
    (0, typeorm_1.Entity)('uploaded_files')
], FileUploadEntity);
exports.FileUploadEntity = FileUploadEntity;
//# sourceMappingURL=files-upload.entity.js.map