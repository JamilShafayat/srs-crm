import * as Yup from 'yup';
export default class ValidationSchemaDto {
    readonly body: Yup.ObjectSchema<any>;
    readonly query: Yup.ObjectSchema<any>;
    readonly param: Yup.ObjectSchema<any>;
    constructor({ body, query, param, }: {
        body?: Yup.ObjectSchema<any>;
        query?: Yup.ObjectSchema<any>;
        param?: Yup.ObjectSchema<any>;
    });
}
