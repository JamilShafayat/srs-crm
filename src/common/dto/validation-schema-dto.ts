import * as Yup from 'yup';
export default class ValidationSchemaDto {
  public readonly body: Yup.ObjectSchema<any>;
  public readonly query: Yup.ObjectSchema<any>;
  public readonly param: Yup.ObjectSchema<any>;

  constructor({
    body,
    query,
    param,
  }: {
    body?: Yup.ObjectSchema<any>;
    query?: Yup.ObjectSchema<any>;
    param?: Yup.ObjectSchema<any>;
  }) {
    if (body) {
      this.body = body;
    }
    if (query) {
      this.query = query;
    }
    if (param) {
      this.param = param;
    }
  }
}
