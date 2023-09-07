export const loginRoute = '/login';
export const homeRoute = '/';

export const projectRoutes = /\/projects\//;

export const routes = {
  search: ['/projects/:projectId/entities', '/projects/:projectId/documents'],
  annotation: '/projects/:projectId/annotation',
  analytics: '/projects/:projectId/analytics',
  dashboard: '/projects/:projectId/dashboard',
  protocols: '/projects/:projectId/protocols',
  upload: '/projects/:projectId/uploads',
  models: '/projects/:projectId/models',
  exports: '/projects/:projectId/exports',
  settings: '/projects/:projectId/settings'
};
