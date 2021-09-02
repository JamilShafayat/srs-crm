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
exports.DtoValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const customException_1 = require("../exceptions/customException");
const paramValidationException_1 = require("../exceptions/paramValidationException");
const validationException_1 = require("../exceptions/validationException");
let DtoValidationPipe = class DtoValidationPipe {
    constructor(options) {
        this.options = options || {};
        this.options = Object.assign({ stopAtFirstError: true }, this.options);
    }
    async transform(value, { metatype, type }) {
        try {
            console.log('type', type);
            if (type === 'body' || type === 'param') {
                this.options = Object.assign({ whitelist: true, forbidNonWhitelisted: true }, this.options);
            }
            if (!metatype || !this.toValidate(metatype)) {
                return value;
            }
            const object = (0, class_transformer_1.plainToClass)(metatype, value);
            const errors = await (0, class_validator_1.validate)(object, this.options);
            if (errors.length > 0) {
                const validationErrors = [];
                for (const [index, error] of errors.entries()) {
                    const property = error.property;
                    const errorCollection = [];
                    if (!error.constraints ||
                        Object.keys(error.constraints).length === 0) {
                        this.findChildError(errorCollection, error.children, property);
                    }
                    else {
                        errorCollection.push({
                            field: error.property,
                            message: error.constraints[Object.keys(error.constraints)[0]],
                        });
                    }
                    validationErrors.push(...errorCollection);
                }
                if (type === 'param') {
                    throw new paramValidationException_1.ParamValidationException(validationErrors.map((error) => error.message));
                }
                else {
                    throw new validationException_1.ValidationException(validationErrors);
                }
            }
            return value;
        }
        catch (error) {
            throw new customException_1.CustomException(error);
        }
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    findChildError(errorCollection, errors, property) {
        for (const [index, error] of errors.entries()) {
            if (!error.constraints || Object.keys(error.constraints).length === 0) {
                const nProperty = '.' + error.property;
                const sProperty = '[' + error.property + ']';
                const newProperty = isNaN(error.property) ? nProperty : sProperty;
                this.findChildError(errorCollection, error.children, property + newProperty);
            }
            else {
                errorCollection.push({
                    field: property + '.' + error.property,
                    message: error.constraints[Object.keys(error.constraints)[0]],
                });
            }
        }
    }
};
DtoValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [Object])
], DtoValidationPipe);
exports.DtoValidationPipe = DtoValidationPipe;
//# sourceMappingURL=dtoValidation.pipe.js.map