"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = require("yup");
const validation_schema_dto_1 = require("../../../../common/dto/validation-schema-dto");
const exampleCreateFilter = new validation_schema_dto_1.default({
    body: Yup.object().shape({
        categoryId: Yup.number()
            .typeError('categoryId must be a number')
            .required('Category is required'),
        latitude: Yup.number().typeError('latitude must be a number'),
        longitude: Yup.number().typeError('longitude must be a number'),
        mediaTopSection: Yup.array()
            .typeError('mediaTopSection must be a `array` type')
            .of(Yup.number().typeError('MediaTopSection data must be number')),
        slug: Yup.string().max(255).required('Article slug is required'),
        sections: Yup.array()
            .typeError('sections must be a `array` type')
            .of(Yup.object().shape({
            title: Yup.string().max(500).required('Title is required'),
            subTitle: Yup.string().max(600).required('Sub title is required'),
            description: Yup.string().required('Description is required'),
            sectionMedia: Yup.array()
                .typeError('sectionMedia must be a `array` type')
                .of(Yup.number().typeError('sectionMedia data must be number')),
        })),
        tags: Yup.array()
            .typeError('tags must be a `array` type')
            .of(Yup.number().typeError('tags data must be number')),
    }),
});
exports.default = exampleCreateFilter;
//# sourceMappingURL=exampleCreateFilter.js.map