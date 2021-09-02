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
exports.YupValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const Yup = require("yup");
const yup_1 = require("yup");
const validation_schema_dto_1 = require("../dto/validation-schema-dto");
const customInternalServerException_1 = require("../exceptions/customInternalServerException");
const paramValidationException_1 = require("../exceptions/paramValidationException");
const validationException_1 = require("../exceptions/validationException");
let YupValidationPipe = class YupValidationPipe {
    constructor(schema) {
        this.schema = schema;
    }
    async transform(value, metadata) {
        try {
            if (this.schema instanceof Yup.ObjectSchema && metadata.type === 'body') {
                await this.schema.validate(value, { abortEarly: false });
            }
            else if (this.schema instanceof validation_schema_dto_1.default) {
                const { body = false, query = false, param = false } = this.schema;
                if (metadata.type === 'param' && param) {
                    await param.validate(value, { abortEarly: false });
                }
                else if (metadata.type === 'body' && body) {
                    await body.validate(value, { abortEarly: false });
                }
                else if (metadata.type === 'query' && query) {
                    await query.validate(value, { abortEarly: false });
                }
            }
            return value;
        }
        catch (err) {
            const errors = [];
            if (metadata.type === 'param') {
                throw new paramValidationException_1.ParamValidationException(err.errors);
            }
            else if (err instanceof yup_1.ValidationError) {
                err.inner.forEach((err) => {
                    const error = {
                        field: err.path,
                        message: err.message,
                    };
                    errors.push(error);
                });
                throw new validationException_1.ValidationException(errors);
            }
            else {
                throw new customInternalServerException_1.CustomInternalServerException(err);
            }
        }
    }
};
YupValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], YupValidationPipe);
exports.YupValidationPipe = YupValidationPipe;
//# sourceMappingURL=yupValidationPipe.js.map