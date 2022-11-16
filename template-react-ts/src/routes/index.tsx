import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('@/pages/home'))

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to='/home' replace />
    },
    {
        path: '/home',
        element: <Home />
    }
]

export default routes