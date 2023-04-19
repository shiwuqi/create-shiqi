import {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  CSSProperties,
} from 'react';
import { Select, Spin, Empty } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {
  find,
  map,
  get,
  forEach,
  set,
  isEmpty,
  isString,
  omit,
  debounce,
  isObject,
  isArray,
  isEqual,
} from 'lodash-es';

import request from '@/utils/request';
import { useEffectExceptFirst } from '@/hooks';

import { IFormProps } from '@/typings/common';

type IDataSource = {
  label?: string;
  text?: string;
  value: string | number;
}[];

type IProps = {
  name?: string;
  value: any;
  placeholder?: string;
  labelInValue?: boolean;
  disabled?: boolean;
  mutiple?: boolean;

  firstItemAsDefault?: boolean;
  showSearch?: boolean;
  searchkey?: string;
  showFilter?: boolean;
  allowClear?: boolean;

  url?: string;
  list?: IDataSource;
  format?: {
    label: string;
    value: string;
    [props: string]: string;
  };
  enableKey?: string;
  datamapping?: string;
  requestdata?: object;

  dependon?: string[];
  'dependon-action'?: string;
  'dependon-data'?: object;
  'rest-data'?: string[];
  'post-data'?: object | string;

  style?: CSSProperties;

  form: IFormProps;
  onChange: (values: any) => void;
};

const CSelect = (props: IProps, _ref: unknown) => {
  const {
    name,
    value,
    url,
    list,
    placeholder,
    labelInValue,
    disabled,
    mutiple,
    firstItemAsDefault,
    showSearch,
    searchkey,
    showFilter,
    allowClear,
    enableKey,
    format,
    datamapping,
    requestdata,
    dependon,
    style,
    form,
    onChange,
  } = props;
  const dependonAction = props['dependon-action'];
  const dependonData = props['dependon-data'];
  const restData = props['rest-data'];
  const postData = props['post-data'];

  const defaultValue = useMemo(() => {
    if (!value) {
      return value;
    }

    if (postData) {
      const data: any = {};
      if (isObject(postData) && labelInValue) {
        forEach(postData, (item, key) => {
          data[item] = value?.[key];
        });

        if (labelInValue) {
          return data.value;
        }

        return data;
      }
    }

    return value;
  }, [labelInValue]);

  const [innerValue, setInnerValue] = useState(defaultValue);

  const [params, setParams] = useState<{ [prop: string]: string }>({});
  const [selectProps, setSelectProps] = useState<{
    [props: string]: unknown;
  }>();

  const dependOnFieldsStr = dependon
    ? JSON.stringify(form?.getFieldsValue(dependon))
    : '{}';
  const dependOnFields = useMemo(() => {
    const data = JSON.parse(dependOnFieldsStr);
    let dependonParams = data;
    if (data && !isEmpty(data) && dependonData) {
      forEach(dependonData, (item, key) => {
        // dependonParams = omit(dependonParams, [item]);
        if (isObject(item)) {
          const { value, type } = item;
          const fieldValue = get(data, value);
          switch (type) {
            case 'array': {
              if (isArray(fieldValue)) {
                dependonParams[key] = fieldValue;
              } else {
                dependonParams[key] = [fieldValue];
              }

              break;
            }
          }
        } else {
          dependonParams[key] = get(data, item);
        }
      });
    }

    forEach(dependonParams, (item, key) => {
      if (!item || (isObject(item) && isEmpty(item))) {
        dependonParams = omit(dependonParams, [key]);
      }
    });

    return dependonParams;
  }, [dependOnFieldsStr, dependonData]);
  const isMounted = useRef(false);

  // 获取下拉框数据
  const { data: dataSource, isFetching } = useQuery(
    [url, { ...requestdata, ...dependOnFields, ...params, list, enableKey }],
    () => {
      if (url) {
        return request<IDataSource>(url, {
          method: requestdata ? 'post' : 'get',
          params: {
            ...requestdata,
            ...dependOnFields,
            ...params,
          },
        });
      } else {
        return new Promise<IDataSource>((resolve) => {
          resolve(list || []);
        });
      }
    },
    {
      initialData: [],
      select: useCallback((res: IDataSource) => {
        if (!url) {
          return res;
        }

        let result = res;
        if (datamapping) {
          result = get(result, datamapping) as any;
        }

        if (format) {
          const { label, value, ...rest } = format;

          const dataSource = map(result, (item) => {
            const dataItem = {
              label: get(item, label),
              value: get(item, value),
            };

            if (restData) {
              forEach(restData, (restItem) => {
                if (rest[restItem]) {
                  set(dataItem, restItem, get(item, rest[restItem]));
                } else {
                  set(dataItem, restItem, get(item, restItem));
                }
              });
            }

            return dataItem;
          });

          return dataSource as IDataSource;
        }

        return map(result, (item) => {
          if (isString(item)) {
            return {
              label: item,
              value: item,
            };
          }
          const dataItem = {
            label: get(item, 'label'),
            value: get(item, 'value'),
          };

          if (restData) {
            forEach(restData, (restItem) => {
              set(dataItem, restItem, get(item, restItem));
            });
          }

          return dataItem;
        }) as IDataSource;
      }, []),
      enabled: enableKey ? !!get(dependOnFields, enableKey) : true,
    }
  );

  // 变更
  const selectChange = useCallback(
    (value: string) => {
      if (name) {
        form[name] = true;
      }

      if (labelInValue) {
        if (mutiple) {
          const items = map(
            value,
            (item) => find(dataSource, { value: item }) || null
          );
          setInnerValue(items);
          // onChange && onChange(items);
        } else {
          const item = find(dataSource, { value }) || null;
          setInnerValue(item);
          // onChange && onChange(item);
        }
      } else {
        setInnerValue(value);
        // onChange && onChange(value);
      }
    },
    [labelInValue, mutiple, dataSource, name, form, onChange]
  );

  // 搜索
  const onSearch = useCallback(
    debounce((value: string) => {
      if (searchkey) {
        setParams({
          [searchkey]: value,
        });
      }
    }, 500),
    [searchkey]
  );

  const onClear = useCallback(() => {
    if (params && !isEmpty(params) && searchkey) {
      setParams({
        [searchkey]: '',
      });
    }
  }, [searchkey, params]);

  useEffect(() => {
    if (!isMounted.current) {
      if (dataSource?.length) {
        isMounted.current = true;
      }
      return;
    }

    if (dependonAction === 'clear' && value) {
      // 被动修改
      if (name) {
        form[name] = false;
      }
      setInnerValue(undefined);
    } else if (dependonAction === 'setValue') {
      // 被动修改
      if (name) {
        form[name] = false;
      }
      const item = find(dataSource, dependOnFields);
      setInnerValue((item as any)?.value);
    }
  }, [dependOnFields, dependonAction]);

  useEffect(() => {
    const selectProps: any = {};

    selectProps.placeholder = placeholder || '请选择';

    // 过滤，不涉及额外请求
    if (showFilter) {
      selectProps.showSearch = true;
      selectProps.optionFilterProp = 'label';
      selectProps.filterOption = (inputValue: string, option: any) =>
        option?.props?.children?.indexOf(inputValue) > -1;
    }

    // 搜索涉及 额外请求
    if (showSearch) {
      selectProps.showSearch = true;
      selectProps.filterOption = false;
      selectProps.onSearch = onSearch;
      selectProps.onClear = onClear;
    }

    setSelectProps(selectProps);
  }, [placeholder, showSearch, showFilter, onClear, onSearch]);

  useEffect(() => {
    if (firstItemAsDefault && dataSource?.length) {
      // 其被动修改，默认为不修改
      if (name) {
        form[name] = false;
      }

      if (labelInValue) {
        setInnerValue(dataSource[0]);
      } else {
        setInnerValue(dataSource[0].value);
      }
    }
  }, [firstItemAsDefault, dataSource, labelInValue, name]);

  useEffectExceptFirst(() => {
    if (postData && !isEmpty(postData)) {
      if (labelInValue && isObject(postData)) {
        if (innerValue) {
          const data: any = {};
          forEach(postData, (item, key) => {
            data[key] = innerValue?.[item];
          });

          onChange && onChange(data);
        } else {
          onChange && onChange(innerValue);
        }
      } else if (isString(postData)) {
        onChange && onChange({ [postData]: innerValue });
      }
    } else {
      onChange && onChange(innerValue);
    }
  }, [innerValue]);

  useEffectExceptFirst(() => {
    let compareValue = value;

    if (postData && value) {
      const data: any = {};
      if (isObject(postData) && labelInValue) {
        forEach(postData, (item, key) => {
          data[item] = value?.[key];
        });

        compareValue = data;
      }
    }

    if (
      (!isObject(innerValue) && innerValue !== compareValue) ||
      (isObject(innerValue) && !isEqual(innerValue, compareValue))
    ) {
      setInnerValue(compareValue);
    }
  }, [value, postData, labelInValue]);

  return (
    <Select
      value={innerValue}
      {...selectProps}
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      mode={mutiple ? 'multiple' : undefined}
      onChange={selectChange}
      style={style}
      options={dataSource}
      notFoundContent={
        isFetching ? (
          <Spin size="small" />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      }
    />
  );
};

export default forwardRef(CSelect);