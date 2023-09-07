import { Navigate, useLocation } from 'react-router-dom';

// project imports
import { localStorageKeys } from 'aida-constants';
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';
import { loginRoute } from './urls';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

export const GuestGuard = ({ children }) => {
  const { user } = useAuth();
  const { state } = useLocation();

  if (user) {
    // when the user tries to log in again,
    // the browser redirects to the page the user was previously on,
    // instead of going to the default home page #404
    let redirectToUrl = DASHBOARD_PATH;
    const lastPathName = window.localStorage.getItem(localStorageKeys.LastPagePathName);
    if (lastPathName) {
      window.localStorage.clear(localStorageKeys.LastPagePathName);
      if (lastPathName !== loginRoute) redirectToUrl = lastPathName;
    }
    return <Navigate to={state?.referrer ?? redirectToUrl} replace />;
  }

  return children;
};
