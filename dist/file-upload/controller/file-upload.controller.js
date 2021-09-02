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
exports.FileUploadController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const file_rename_utils_1 = require("../../common/utilities/file-rename.utils");
const file_upload_type_utils_1 = require("../../common/utilities/file-upload-type.utils");
const payload_response_dto_1 = require("../../common/dto/payload-response.dto");
let FileUploadController = class FileUploadController {
    uploadSingleFileWithPost(file, body) {
        console.log(file);
        const response = file.filename;
        return new payload_response_dto_1.PayloadResponseDTO({
            statusCode: common_1.HttpStatus.OK,
            message: '',
            data: { file_name: response },
        });
    }
    seeUploadedFile(image, res) {
        return res.sendFile(image, { root: './files' });
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file_name', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: file_rename_utils_1.changeFileName,
        }),
        fileFilter: file_upload_type_utils_1.imageFileFilter,
    })),
    openapi.ApiResponse({ status: 201, type: require("../../common/dto/payload-response.dto").PayloadResponseDTO }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FileUploadController.prototype, "uploadSingleFileWithPost", null);
__decorate([
    (0, common_1.Get)(':imgpath'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('imgpath')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FileUploadController.prototype, "seeUploadedFile", null);
FileUploadController = __decorate([
    (0, common_1.Controller)('v1/file')
], FileUploadController);
exports.FileUploadController = FileUploadController;
//# sourceMappingURL=file-upload.controller.js.map