import { FC, Suspense, useMemo, useCallback } from 'react';
import { App, Layout, Breadcrumb, Dropdown, Spin } from 'antd';
import { useNavigate, useLocation, To, Outlet } from 'react-router-dom';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { CaretDownOutlined } from '@ant-design/icons';
import { find } from 'lodash-es';
import { Header, Sidebar } from '@/components';
import type { ILink } from '@/components/sidebar';
import type { MenuProps } from 'antd';

import logo from '/vite.svg';

const { Content, Sider } = Layout;

type IProps = {
    links: ILink[];
};

const BaseLayout: FC<IProps> = (props) => {

    const { links } = props;

    const { modal } = App.useApp();

    const navigate = useNavigate();
    const location = useLocation();

    const defaultOpenKeys = useMemo(() => {
        const { pathname } = location;

        return [pathname];
    }, [location]);

    const breadcrumbs = useMemo(() => {
        const item = find(links, i => i.path === defaultOpenKeys[0]);
        return [
            {
                href: '/sz/stadium',
                title: '首页',
            },
            {
                href: item && item.path,
                title: item && item.title
            }
        ];
    }, [links, defaultOpenKeys]);

    const dropdownItems = useMemo(() => {
        const items: MenuProps['items'] = [
            {
                label: '个人中心',
                key: 'user',
            },
            {
                label: '退出登陆',
                key: 'logout',
            },
        ];
        return items;
    }, []);

    const dropdownClick: MenuProps['onClick'] = useCallback(({ key }: { key: string; }) => {
        if (key === 'logout') {
            modal.warning({
                title: '提示',
                content: '确定注销并退出系统吗？'
            });
        }
    }, []);

    return (
        <Layout className='w-full h-full overflow-hidden'>
            <Layout className='w-full h-full'>
                <Sider style={{ boxShadow: '0 0 1px rgba(0, 21, 41, .35)' }}>
                    <Header
                        history={(url: To) => navigate(url)}
                        location={location}
                        logo={logo}
                        title='React-antd5'
                    />
                    <Sidebar
                        // theme='dark'
                        height="100%"
                        style={{ height: '100%' }}
                        defaultOpenKeys={defaultOpenKeys}
                        selectedKeys={defaultOpenKeys}
                        history={(url: To) => navigate(url)}
                        location={location}
                        links={links}
                    />
                </Sider>
                <Content className='h-full bg-white'>
                    {qiankunWindow.__POWERED_BY_QIANKUN__ ?
                        null
                        :
                        (
                            <div className='h-14 flex justify-between items-center px-4 bg-white shadow-sm'>
                                <Breadcrumb items={breadcrumbs} />
                                <Dropdown menu={{ items: dropdownItems, onClick: dropdownClick }}>
                                    <span className='inline-flex items-center'>
                                        <img src={logo} className='w-10 h-10 mr-1 rounded-lg' />
                                        <CaretDownOutlined />
                                    </span>
                                </Dropdown>
                            </div>
                        )
                    }
                    <Suspense fallback={(<div className="text-center pt-11"><Spin /></div>)}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Layout>
        </Layout >
    );
};

export default BaseLayout;