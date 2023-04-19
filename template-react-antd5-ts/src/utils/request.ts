import { message } from 'antd';
import { isNull, isEmpty } from 'lodash-es';
import { getToken, goLogin } from '@/utils';

interface RequestDataType {
  [key: string]: any;
}

type RequestOptions = RequestInit & {
  params?: RequestDataType;
};

export class ResError extends Error {
  constructor(public code: string | number, public message: string) {
    super(message);
  }
}

function checkSuccess(response: any): any {
  if (response.code !== 200) {
    switch (response.code) {
      case 401: // 登录失效
        message.warning('登录失效，请重新登录！');
        goLogin();
        break;
      default:
        break;
    }
    message.error(response.msg);
    throw new Error(response.msg);
  }
  return response;
}

function getUrl(url: string, params?: RequestDataType): string {
  if (isNull(params) && isEmpty(params)) {
    return url;
  }
  const search = new URLSearchParams(params);
  return `${url}?${search.toString()}`;
}

export default async function request<T>(
  url: string,
  options?: RequestOptions,
  extra?: { actionType?: string }
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: 'Bearer ' + getToken(),
  };

  const method = (
    options?.method != null ? options.method : 'GET'
  ).toLocaleUpperCase();

  let rest = null;
  let formatUrl = url;
  switch (method) {
    case 'GET':
      formatUrl = getUrl(url, options?.params);
      break;
    case 'POST':
    case 'PUT':
      rest = {
        body: JSON.stringify(options?.params),
      };
      break;
    default:
      break;
  }

  const send = {
    method,
    headers,
    ...rest,
  };

  return fetch(formatUrl, send)
    .then(async (response) => {
      if (!response.ok) {
        throw new ResError(response.status, response.statusText);
      }
      if (extra?.actionType === 'download') {
        return {
          data: response,
          code: '000000',
        };
      }
      return response.json();
    })
    .then(checkSuccess);
}

export async function get<T>(url: string, options?: RequestOptions): Promise<T> {
  return request(url, {
    ...options,
    method: 'GET',
  });
}

export async function post<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  return request(url, {
    ...options,
    method: 'POST',
  });
}