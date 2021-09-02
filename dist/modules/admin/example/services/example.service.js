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
exports.ExampleService = void 0;
const common_1 = require("@nestjs/common");
const file_upload_service_1 = require("../../../../common/services/file-upload.service");
let ExampleService = class ExampleService {
    constructor(fileUploadService) {
        this.fileUploadService = fileUploadService;
    }
    async findAll() {
        const isExists = this.fileUploadService.IsExistsTempFile('92-1621609057093-563162133.png');
        this.fileUploadService.moveTempFile('92-1621609057093-563162133.png');
        return 10;
    }
    async itemStore(itemStoreData, manager) {
        await this.tagsStore(itemStoreData.tags, manager);
    }
    async tagsStore(tagItems, manager) {
        for (const tag of tagItems) {
            await this.tagStore(tag, manager);
        }
    }
    async tagStore(tagData, manager) { }
    async tagUpdate(tagData, manager) { }
};
ExampleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [file_upload_service_1.FileUploadService])
], ExampleService);
exports.ExampleService = ExampleService;
//# sourceMappingURL=example.service.js.map