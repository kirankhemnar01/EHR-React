import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

// project imports
// import Loadable from 'ui-component/Loadable';

// login routing
const NotFound = lazy(() => import('../../src/views/error/404'));

const ErrorRoutes = {
  path: '/',
  element: (
    <Outlet />
  ),
  children: [
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default ErrorRoutes;
