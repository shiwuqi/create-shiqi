import { CSSProperties, ChangeEvent } from 'react';
import { Input } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/utils';

import { IFormProps } from '@/typings/common';

type IProps = {
  value: number | string;
  url: string;
  placeholder?: string;
  inputSize?: 'large' | 'middle' | 'small';

  style?: CSSProperties;

  form: IFormProps;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
};

const ValidateCode = (props: IProps) => {
  const { value, url, placeholder, inputSize, style, form, onChange } = props;

  const { data, isLoading } = useQuery<{ img: string }>([url], () => {
    return get<{ img: string }>(url);
  });

  return (
    <div className="flex" style={style}>
      <Input
        className="flex-1 mr-4"
        size={inputSize}
        prefix={<CalculatorOutlined />}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="w-2/6">
        {isLoading && data && (
          <img src={'data:image/gif;base64,' + (data as any).img} />
        )}
      </div>
    </div>
  );
};

export default ValidateCode;