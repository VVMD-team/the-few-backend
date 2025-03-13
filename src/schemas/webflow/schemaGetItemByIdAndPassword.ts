import { object, string } from 'yup';

const schemaGetItemByIdAndPassword = object().shape({
  slug: string().required().label('Item Slug'),
  password: string().label('Password'),
});

export default schemaGetItemByIdAndPassword;
