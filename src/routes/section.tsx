import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import BlankLayout from '../layout/blanckLayout';
import DashboardLayout from '../layout/dashboardLayout';

const SignInPage = lazy(() => import('@/pages/login'));
const HomePage = lazy(() => import('@/pages/home'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));
const CustomerPage = lazy(() => import('@/pages/customer/CustomerPage'));
const DriverPage = lazy(() => import('@/pages/driver/DriverPage'));

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => theme.palette.grey[200],
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'primary.main' },
            }}
        />
    </Box>
);

// Rotas privadas com DashboardLayout
export function PrivateRouter() {
    return useRoutes([
        {
            path: '/',
            element: (
                <DashboardLayout>
                    <Suspense fallback={renderFallback}>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                { index: true, element: <HomePage /> },
                {path: "admin", element: <AdminPage />},
                {path: "clientes", element: <CustomerPage />},
                {path: "cacambeiros", element: <DriverPage />},
            ],
        },
        { path: '*', element: (
            <DashboardLayout>
                    <Suspense fallback={renderFallback}>
                        <NotFoundPage />
                    </Suspense>
                </DashboardLayout>
        ) },
    ]);
}

// Rotas públicas com BlankLayout
export function PublicRouter() {
    return useRoutes([
        {
            path: '/',
            element: (
                <BlankLayout>
                    <Suspense fallback={renderFallback}>
                        <SignInPage />
                    </Suspense>
                </BlankLayout>
            ),
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);
}
