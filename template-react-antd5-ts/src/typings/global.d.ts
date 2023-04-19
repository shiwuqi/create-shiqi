type IFormProps = {
  resetFields: (value?: string[]) => void;
  validateFields: () => Promise<object>;
  setFieldsValue: (values: object) => void;
  getFieldsValue: (values?: (string | string[])[]) => object;
  getFieldsError: (values?: string[]) => { errors: string[] }[];
  isFieldsTouched: (values?: (string | string[])[], allTouched?: boolean) => boolean;
} & {
  [name: string]: boolean;
};

interface Page<T> {
  list: T[];
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPage: number;
};