import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from '@/layouts';

const Home = lazy(() => import('@/pages/home'));
const Demo = lazy(() => import('@/pages/demo'));
const Login = lazy(() => import('@/pages/login'));

const layoutRoutes = [
    {
        title: '首页',
        path: '/prefix/home',
        element: <Home />
    },
    {
        title: '项目维护',
        path: '/prefix/demo',
        element: <Demo />
    },
];

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to='/prefix/home' replace />,
    },
    {
        path: '/prefix',
        element: (
            <Layout
                key='base'
                links={layoutRoutes}
            />
        ),
        children: layoutRoutes
    },
    {
        path: '/login',
        element: <Login />,
    },
];

export default routes;