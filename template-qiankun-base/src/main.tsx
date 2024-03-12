/*
 * @Author: shiqi liziw2012@gmail.com
 * @Date: 2024-03-12 08:56:11
 * @LastEditors: shiqi liziw2012@gmail.com
 * @LastEditTime: 2024-03-12 09:55:03
 * @FilePath: /create-shiqi/template-qiankun-base/src/main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import App from './App';
import './index.css';
import 'antd/dist/antd.css';

const queryClient = new QueryClient();

let root: ReactDOM.Root | null = null;

const render = (props: { container?: HTMLElement } = {}): void => {
  const { container } = props;

  root = ReactDOM.createRoot(
    container
      ? (container.querySelector('#container') as HTMLElement)
      : (document.querySelector('#container') as HTMLElement)
  );

  root.render(
    <Router
      basename={
        qiankunWindow.__POWERED_BY_QIANKUN__
          ? '/qiankun-test'
          : import.meta.env.BASE_URL
      }
    >
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN} theme={{
          token: {
            colorPrimary: '#00B0C6',
          },
        }}>
          <AntdApp className="h-full">
            <App />
          </AntdApp>
        </ConfigProvider>
      </QueryClientProvider>
    </Router>
  );
};

renderWithQiankun({
  mount(props) {
    console.log('mount props:', props);
    render(props);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  update() {
    console.log('update');
  },
  unmount() {
    root && root.unmount();
  },
});

if (
  qiankunWindow.__POWERED_BY_QIANKUN__ === false ||
  qiankunWindow.__POWERED_BY_QIANKUN__ == null
) {
  render();
}