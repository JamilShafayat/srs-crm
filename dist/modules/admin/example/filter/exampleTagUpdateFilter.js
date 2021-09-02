"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = require("yup");
const validation_schema_dto_1 = require("../../../../common/dto/validation-schema-dto");
const exampleTagUpdateFilterSchema = new validation_schema_dto_1.default({
    param: Yup.object().shape({
        exampleId: Yup.number()
            .typeError('Please provide a valid exampleId')
            .min(1, 'Please provide a valid exampleId')
            .required(),
        tagId: Yup.number()
            .typeError('Please provide a valid tagId')
            .min(1, 'Please provide a valid tagId')
            .required(),
    }),
});
exports.default = exampleTagUpdateFilterSchema;
//# sourceMappingURL=exampleTagUpdateFilter.js.map