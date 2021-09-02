import * as Yup from 'yup';
import ValidationSchemaDto from '../../../../common/dto/validation-schema-dto';

// example tag update
const exampleTagUpdateFilterSchema = new ValidationSchemaDto({
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

export default exampleTagUpdateFilterSchema;
