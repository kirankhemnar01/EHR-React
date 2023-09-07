import { lazy } from 'react';

// project imports
import { GuestGuard } from './guard';
import { AuthLayout } from 'views/authentication/components/layout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';

// login routing
const Signin = Loadable(lazy(() => import('views/authentication/features/signin')));
const SSOSignin = Loadable(lazy(() => import('views/authentication/features/sso-signin')));
const Signup = Loadable(lazy(() => import('views/authentication/features/signup')));
const ForgotPassword = Loadable(lazy(() => import('views/authentication/features/forgot-password')));
const VerifyUser = Loadable(lazy(() => import('views/authentication/features/verify-user')));

const LoginRoutes = {
  path: '/',
  element: (
    <NavMotion>
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    </NavMotion>
  ),
  children: [
    {
      path: '/login',
      element: <Signin />
    },
    {
      path: '/sso-login',
      element: <SSOSignin />
    },
    {
      path: '/register',
      element: <Signup />
    },
    {
      path: '/forgot',
      element: <ForgotPassword />
    },
    {
      path: '/verify',
      element: <VerifyUser />
    }
  ]
};

export default LoginRoutes;
