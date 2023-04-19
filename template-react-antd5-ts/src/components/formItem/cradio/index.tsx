import { forwardRef, useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { Radio, RadioChangeEvent, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { useQuery } from '@tanstack/react-query';
import { map, get, find, forEach, set, isEqual } from 'lodash-es';
import request from '@/utils/request';

type ISource = {
  label: string;
  value: string | number;
  tips?: string;
  disabled?: boolean;
};

type IDataSource = ISource[];

type IProps = {
  name?: string;
  value: any;
  labelInValue: boolean;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';

  optionType?: 'button' | 'default';
  firstItemAsDefault?: boolean;

  url?: string;
  list?: IDataSource;
  'rest-data'?: string[];
  format?: {
    label: string;
    value: string;
    tips?: string;
    disabled?: string;
  };
  datamapping?: string;
  requestdata?: object;

  dependon?: string[];
  'dependon-data'?: object;

  form?: IFormProps;
  onChange: (values: any) => void;
};

const CRadio = (props: IProps, _ref: unknown) => {
  const {
    name, value, labelInValue, disabled, size, optionType, firstItemAsDefault,
    url, list, format, datamapping, requestdata,
    dependon, form, onChange,
  } = props;
  const defaultValue = useMemo(() => value, []);
  const [innerValue, setInnerValue] = useState<string | number | ISource>(defaultValue);
  const dependonData = props['dependon-data'];
  const restData = props['rest-data'];

  useEffect(() => {
    if (!isEqual(value, innerValue)) {
      setInnerValue(value);
    }
  }, [value]);

  // 处理监听数据
  const dependOnFieldsStr = dependon ? JSON.stringify(form?.getFieldsValue(dependon)) : '{}';
  const dependOnFields = useMemo(() => {
    const dependonParams = JSON.parse(dependOnFieldsStr);
    if (dependonData) {
      forEach(dependonData, (item, key) => {
        dependonParams[key] = get(dependonParams, item);
      });
    }
    return dependonParams;
  }, [dependOnFieldsStr, dependonData]);
  const isMounted = useRef(false);

  // 获取数据
  const { data: dataSource } = useQuery([url, { ...requestdata, ...dependOnFields, list }], () => {
    if (url) {
      return (
        request<IDataSource>(url, {
          method: requestdata ? 'post' : 'get',
          params: {
            ...requestdata,
            ...dependOnFields,
          },
        })
      );
    } else {
      return new Promise<IDataSource>((resolve) => {
        resolve(list || []);
      });
    }
  }, {
    select: useCallback((value: any[]) => {
      if (!url) {
        return value;
      }

      let result = value;
      if (datamapping) {
        result = get(value, datamapping) as any;
      }

      if (format) {
        const { label, value, tips, disabled, ...rest } = format;

        const dataSource = map(result, item => {
          const dataItem = {
            label: get(item, label || 'label'),
            value: get(item, value || 'value'),
            tips: get(item, tips || 'tips'),
            disabled: get(item, disabled || 'disabled'),
          };

          if (restData) {
            forEach(restData, restItem => {
              if ((rest as any)[restItem]) {
                set(dataItem, restItem, get(item, (rest as any)[restItem]));
              } else {
                set(dataItem, restItem, get(item, restItem));
              }
            });
          }

          return dataItem;
        });

        return dataSource as IDataSource;
      }

      return map(result, item => {
        const dataItem = {
          label: get(item, 'label'),
          value: get(item, 'value'),
          tips: get(item, 'tips'),
          disabled: get(item, 'disabled'),
        };

        if (restData) {
          forEach(restData, restItem => {
            set(dataItem, restItem, get(item, restItem));
          });
        }

        return dataItem;
      }) as IDataSource;
    }, []),
  });

  // 处理修改
  const handlerChange = useCallback((event: RadioChangeEvent) => {
    const value = event.target.value;

    // 其主动修改，默认为修改
    if (form && name) {
      form[name] = true;
    }

    if (labelInValue) {
      const item = find(dataSource, { value });
      if (!item) {
        return;
      }
      setInnerValue(item);
    } else {
      setInnerValue(value);
      // onChange(value);
    }
  }, [labelInValue, dataSource]);

  // 处理默认选中
  useEffect(() => {
    if (firstItemAsDefault && dataSource?.length) {
      // 其被动修改，默认为不修改
      if (form && name) {
        form[name] = false;
      }
      if (labelInValue) {
        setInnerValue(dataSource[0]);
      } else {
        setInnerValue(dataSource[0].value);
      }
    }
  }, [firstItemAsDefault, dataSource, labelInValue, name]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    onChange && onChange(innerValue);
  }, [innerValue]);

  return (
    <Radio.Group
      value={labelInValue ? (innerValue as ISource)?.value : innerValue}
      onChange={handlerChange}
      disabled={disabled}
      size={size}
      className='inline-flex flex-wrap'
    >
      {
        map(dataSource, item => (
          optionType === 'button' ? (
            <Radio.Button key={item.value} value={item.value} disabled={item?.disabled}>
              <div className='flex items-center px-2'>
                <span>{item.label}</span>
                {
                  item.tips && (
                    <Tooltip title={item.tips}>
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  )
                }
              </div>
            </Radio.Button>
          ) : (
            <Radio key={item.value} value={item.value}>{item.label}</Radio>
          )
        ))
      }
    </Radio.Group>
  );
};

export default forwardRef(CRadio);