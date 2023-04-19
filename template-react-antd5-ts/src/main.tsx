import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper';
import { StyleProvider } from '@ant-design/cssinjs';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import App from './App';
import GlobalStyles from '@/styles/GlobalStyles'
import './index.css';
import 'antd/dist/reset.css';

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
    <StyleProvider hashPriority="high">
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
              <GlobalStyles />
              <App />
            </AntdApp>
          </ConfigProvider>
        </QueryClientProvider>
      </Router>
    </StyleProvider>
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