import { lazy } from 'react';

// import { Worker } from '@react-pdf-viewer/core';

// project imports
// import MainLayout from 'layout/MainLayout';
// import Loadable from 'ui-component/Loadable';
import { Outlet } from 'react-router-dom';

import { Navigate } from 'react-router-dom';

// sample page routing
const HomePage = lazy(() => import('../../src/views/workspace/Home'));




// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <Outlet />
  ),
  children: [
    {
      path: '/',
      element: <HomePage />
    }
  ]
};

export default MainRoutes;
