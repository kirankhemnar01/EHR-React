import { lazy } from 'react';

// project imports
import { AdminLayout } from 'views/admin/components/layout';
import Loadable from 'ui-component/Loadable';
import { AuthGuard, AdminGuard } from './guard';

// login routing
const AuthSetting = Loadable(lazy(() => import('views/admin/features/auth')));
const Users = Loadable(lazy(() => import('views/admin/features/users')));
const UserInvite = Loadable(lazy(() => import('views/admin/features/users/user-invite')));
const UserAccess = Loadable(lazy(() => import('views/admin/features/users/user-access')));
const Projects = Loadable(lazy(() => import('views/admin/features/projects')));
const SSO = Loadable(lazy(() => import('views/admin/features/sso')));
const License = Loadable(lazy(() => import('views/admin/features/license')));
const CloudStorages = Loadable(lazy(() => import('views/admin/features/storages')));
const CloudStorageList = Loadable(lazy(() => import('views/admin/features/storages/storages')));
const CloudStorageCreate = Loadable(lazy(() => import('views/admin/features/storages/storage-create')));
const CloudStorageEdit = Loadable(lazy(() => import('views/admin/features/storages/storage-edit')));
const ActivityLogs = Loadable(lazy(() => import('views/admin/features/activity-logs')));

const AdminRoutes = {
  path: '/admin',
  element: (
    <AuthGuard>
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    </AuthGuard>
  ),
  children: [
    {
      path: '/admin/auth',
      element: <AuthSetting />
    },
    {
      path: '/admin/users',
      element: <Users />
    },
    {
      path: '/admin/users/invite',
      element: <UserInvite />
    },
    {
      path: '/admin/users/:userId/access',
      element: <UserAccess />
    },
    {
      path: '/admin/projects',
      element: <Projects />
    },
    {
      path: '/admin/sso',
      element: <SSO />
    },
    {
      path: '/admin/license',
      element: <License />
    },
    {
      path: '/admin/storages',
      element: <CloudStorages />,
      children: [
        {
          path: '/admin/storages',
          element: <CloudStorageList />
        },
        {
          path: '/admin/storages/create',
          element: <CloudStorageCreate />
        },
        {
          path: '/admin/storages/:storageId/edit',
          element: <CloudStorageEdit />
        }
      ]
    },
    {
      path: '/admin/activity-logs',
      element: <ActivityLogs />
    }
  ]
};

export default AdminRoutes;
