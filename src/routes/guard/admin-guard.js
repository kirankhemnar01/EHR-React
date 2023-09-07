import useAuth from 'hooks/useAuth';
import { Navigate } from 'react-router-dom';

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
export const AdminGuard = ({ children }) => {
  const { user } = useAuth();

  if (user?.role_name !== 'Admin') {
    return <Navigate to='/' />
  }

  return children;
};
