import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { FormRender, ValidateCode } from '@/components';
import { post, setToken } from '@/utils';

import { IFormProps } from '@/typings/common';

FormRender.use('validateCode', ValidateCode);

const { Title, Text } = Typography;

const options = [
  {
    type: 'input',
    name: 'username',
    prefix: <UserOutlined />,
    size: 'large',
    placeholder: '请输入账号',
    rules: [{ required: true, message: '请输入账号' }],
  },
  {
    type: 'password',
    name: 'password',
    prefix: <LockOutlined />,
    size: 'large',
    placeholder: '请输入密码',
    maxLength: 30,
    rules: [{ required: true, message: '请输入密码' }],
  },
  {
    type: 'validateCode',
    name: 'code',
    inputSize: 'large',
    placeholder: '验证码',
    url: '/api/code',
    rules: [{ required: true, message: '请输入验证码' }],
  },
];

const Login = () => {
  const navigate = useNavigate();

  const formRef = useRef<IFormProps>();

  const submit = useCallback(() => {
    formRef.current?.validateFields().then((values) => {
      post<{ access_token: string; expires_in: number; }>(
        '/api/auth/login',
        {
          params: {
            ...values,
            systemType: 2,
          },
        }
      ).then((res) => {
        message.success('登录成功');
        const { access_token, expires_in } = res;
        setToken(access_token, expires_in);
        navigate('/prefix/home');
      });
    });
  }, []);

  return (
    <div
      className={`
            relative flex justify-center items-center h-full
            ${'bg-[url("https://tf.wdjiayuan.com/static/img/login-background.64d9a1af.jpg")]'}
            bg-cover
        `}
    >
      <div className="absolute right-32 w-96 rounded-2xl bg-white p-6">
        <Title level={4} className="w-full text-center mb-6 text-slate-500">
          终端取号机
        </Title>
        <FormRender
          options={options}
          wrappedComponentRef={(inst: any) => {
            formRef.current = inst as any;
          }}
        />
        <Button type="primary" size="large" className="w-full" onClick={submit}>
          登录
        </Button>
      </div>
      <div className="fixed bottom-4">
        <Text className="text-white">
          Copyright © 2020-2022 善智爱到家探访后台管理系统
          版权所有备案序号：皖ICP备20001767号
        </Text>
      </div>
    </div>
  );
};

export default Login;