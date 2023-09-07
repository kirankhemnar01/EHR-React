import { matchPath } from 'react-router-dom';
import { projectRoutes, routes } from './urls';

const isAllowed = (path, permissions) => {
  if (!permissions || !permissions.length) return false;

  const {
    role: { allow_scopes: allowed, deny_scopes: denied }
  } = permissions[0];

  if (denied?.length > 0) {
    for (const rule of denied) {
      const segment = rule.split(':')[1];
      if (segment) {
        const keys = routes[segment];
        if (typeof keys === 'string') {
          if (matchPath(keys, path)) {
            return false;
          }
        } else if (Array.isArray(keys)) {
          if (keys.some((key) => matchPath(key, path))) {
            return false;
          }
        }
      }
    }

    return true;
  }

  if (allowed.length > 0) {
    for (const rule of allowed) {
      const segment = rule.split(':')[1];
      if (segment) {
        const keys = routes[segment];
        if (typeof keys === 'string') {
          if (matchPath(keys, path)) {
            return true;
          }
        } else if (Array.isArray(keys)) {
          if (keys.some((key) => matchPath(key, path))) {
            return true;
          }
        }
      }
    }
  }

  return true;
};

export const isAllowedMenu = (id, permissions) => {
  const {
    role: { allow_scopes: allowed, deny_scopes: denied }
  } = permissions[0];

  if (denied?.length > 0) {
    for (const rule of denied) {
      const segment = rule.split(':')[1];
      if (segment) {
        if (id === segment) {
          return false;
        }
      }
    }

    return true;
  }

  if (allowed.length > 0) {
    for (const rule of denied) {
      const segment = rule.split(':')[1];
      if (segment) {
        if (id === segment) {
          return true;
        }
      }
    }

    return false;
  }

  return true;
};

export const isAllowedPath = (path, permissions) => {
  if (!projectRoutes.test(path)) {
    return true;
  }

  return isAllowed(path, permissions);
};

export const usePermissions = (permissions, pathname) => {
  const allowed = isAllowedPath(pathname, permissions);
  if (allowed) {
    return { loading: false, allowed };
  }

  if (permissions) {
    return { loading: false, allowed };
  }

  return { loading: true };
};

// implement a simple role-based control rule:
//   if a reviewer's role is not Admin and Manager,
//   hide the Review Batches and Review Analytics menu items so they cannot access these two pages.
export const isAdminOrManagerAllowedReviewSubMenu = (id, permissions) => {
  const { role_id: roleId } = permissions[0];
  const ids = ['review-batches', 'review-analytics'];
  if (roleId !== 'admin' && roleId !== 'manager' && ids.indexOf(id) !== -1) return false;

  return true;
};

// hide the entire Settings section on the vertical menu for reviewers who are not Admin and Manager
export const isAdminOrManagerAllowedMenu = (id, permissions) => {
  const { role_id: roleId } = permissions[0];
  const ids = ['settings'];
  if (roleId !== 'admin' && roleId !== 'manager' && ids.indexOf(id) !== -1) return false;

  return true;
};
