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
exports.FileUploadService = void 0;
const fs = require("fs");
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const mv = require("mv");
let FileUploadService = class FileUploadService {
    constructor(redisService) {
        this.redisService = redisService;
        this.IsExistsTempFile = (fileName) => {
            const folder = fileName.split('.').slice(0, -1).join('.');
            try {
                if (!folder)
                    return false;
                if (!fs.existsSync(process.env.TEMP_FILES_DIR + '/' + folder))
                    return false;
                return true;
            }
            catch (err) {
                return false;
            }
        };
        this.moveTempFile = (fileName) => {
            const folder = fileName.split('.').slice(0, -1).join('.');
            try {
                if (folder) {
                    if (fs.existsSync(process.env.TEMP_FILES_DIR + '/' + folder)) {
                        mv(process.env.TEMP_FILES_DIR + '/' + folder, process.env.FILES_DIR + '/' + folder, { mkdirp: true }, function (err) {
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            catch (err) {
                return false;
            }
        };
    }
    async IsFileExists(url) {
        if (url) {
            const imagePath = url.split(process.env.HOST_URL);
            if (imagePath.length !== 2) {
                return undefined;
            }
            const path = await this.urlToPath(url);
            if (!path) {
                return undefined;
            }
            const isFile = await fs.existsSync(path + '');
            if (isFile === true) {
                return path.valueOf();
            }
        }
        return undefined;
    }
    async urlToPath(url) {
        const imagePath = url.split(process.env.HOST_URL);
        if (imagePath.length !== 2) {
            return undefined;
        }
        const path = process.env.DIR + '' + imagePath[1];
        return path;
    }
    async FileCopy(token, url, path, name) {
        const filePath = await this.IsFileExists(url);
        if (filePath) {
            const fileExtence = filePath.split('.');
            const pathImage = process.env.DIR +
                '/assets/' +
                path +
                '/' +
                name +
                '.' +
                (fileExtence.length === 2 ? fileExtence[1] : '');
            const urlImage = process.env.HOST_URL +
                '/assets/' +
                path +
                '/' +
                name +
                '.' +
                (fileExtence.length === 2 ? fileExtence[1] : '');
            try {
                await fs.mkdirSync(process.env.DIR + '/assets/' + path + '/', {
                    recursive: true,
                });
                if (filePath + '' !== '' + pathImage)
                    await fs.copyFileSync(filePath + '', '' + pathImage);
                const imagePaths = await this.redisService
                    .getClient('REDIS_TMP_FILE')
                    .lrange(token + '', 0, -1);
                for (let i = 0; i < imagePaths.length; i++) {
                    if (imagePaths[i] + '' === filePath + '') {
                        await this.redisService
                            .getClient('REDIS_TMP_FILE')
                            .lrem(token + '', -1, imagePaths[i] + '');
                        break;
                    }
                }
                return urlImage;
            }
            catch (error) {
                console.log(error);
                return undefined;
            }
        }
        return undefined;
    }
    async arrImagesCopy(token, currUrls, newUrls, path, name) {
        try {
            const tmpFile = currUrls;
            for (let i = 0; i < newUrls.length; i++) {
                if (currUrls[i] + '' === '' + newUrls[i]) {
                    continue;
                }
                else if (newUrls[i]) {
                    const filepath = await this.FileCopy(token, newUrls[i], path, `${name}${i}`);
                    tmpFile[i] = filepath ? filepath : tmpFile[i];
                }
                else {
                    tmpFile[i] = null;
                }
            }
            newUrls = tmpFile.filter(function (el) {
                return el != null;
            });
            if (newUrls.length === 0) {
                newUrls = [];
            }
            return newUrls;
        }
        catch (error) {
            console.log(error);
            return currUrls;
        }
    }
};
FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService])
], FileUploadService);
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=file-upload.service.js.map