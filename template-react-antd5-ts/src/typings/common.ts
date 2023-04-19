type IFormProps = {
  resetFields: (value: string[]) => void;
  validateFields: () => Promise<object>;
  setFieldsValue: (values: object) => void;
  getFieldsValue: (values?: (string | string[])[]) => object;
  getFieldsError: (values?: string[]) => { errors: string[] }[];
} & {
  [name: string]: boolean;
};

type IFormOption = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  defaultShow?: boolean;
  defaultValue?: unknown;
  noLabel?: boolean;
  constant?: boolean;
  multiple?: boolean;
  firstItemAsDefault?: boolean;
  labelCol?: {
    offset?: number;
    span?: number;
  };
  wrapperCol?: {
    offset?: number;
    span?: number;
  };
  wrapperFull?: boolean;
  show?:
  | {
    key: string;
    value: string | string[];
    logic?: string;
    compareKey?: string;
  }
  | {
    key: string;
    value: string | string[];
    logic?: string;
    compareKey?: string;
  }[];
  rules?: {
    message?: string;
    required?: boolean;
    pattern?: string | RegExp;
    validator?: (rule: unknown, value: unknown) => Promise<void>;
    validateTrigger?: string | string[];
    fields?: {
      [name: string]: {
        message: string;
        requried?: boolean;
        pattern?: string | RegExp;
      }[];
    };
  }[];
};

export type { IFormProps, IFormOption };