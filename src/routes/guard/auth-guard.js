import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { usePermissions } from './use-permissions';
import { loginRoute, homeRoute } from './urls';
import Loader from 'ui-component/Loader';

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
export const AuthGuard = ({ children }) => {
  const { user, permissions, getPermissions } = useAuth();
  const { projectId } = useParams();
  const { pathname, search } = useLocation();
  const { loading, allowed } = usePermissions(permissions, pathname);

  useEffect(() => {
    if (projectId && user) {
      getPermissions(projectId);
    }
  }, [getPermissions, projectId, user]);

  if (!user) {
    return <Navigate to={loginRoute} replace state={{ referrer: pathname + search }} />;
  }

  if (!allowed) {
    if (loading) {
      return <Loader />;
    }

    return <Navigate to={homeRoute} replace />;
  }

  return children;
};
