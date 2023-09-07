import { createContext, useEffect, useReducer, useCallback, useState } from 'react';
import httpClient from 'service/base';
import { AuthApis } from 'service/auth';
import { loadState } from 'helpers/storage';
import authReducer from './auth-reducer';
import AuthActions from './auth-actions';

const JWTContext = createContext(null);

const initState = loadState('user') ?? {
  tokens: null,
  user: null
};

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initState);
  const [initialized, setInitialized] = useState(false);
  const { tokens } = state;

  useEffect(() => {
    httpClient.init(AuthApis, dispatch);
    httpClient.accessToken = tokens?.accessToken;
    httpClient.refreshToken = tokens?.refreshToken;
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (username, password) => {
    const tokens = await AuthApis.signin(username, password);
    httpClient.accessToken = tokens?.access_token;
    httpClient.refreshToken = tokens?.refresh_token;
    const user = await AuthApis.getMe();
    dispatch({
      type: AuthActions.setUser,
      payload: {
        user,
        tokens: { accessToken: tokens?.access_token, refreshToken: tokens?.refresh_token }
      }
    });
  }, []);

  const ssoLoginWithTokens = useCallback(async (accessToken, refreshToken) => {
    httpClient.accessToken = accessToken;
    httpClient.refreshToken = refreshToken;
    const user = await AuthApis.getMe();
    dispatch({
      type: AuthActions.setUser,
      payload: {
        user,
        tokens: { accessToken, refreshToken }
      }
    });
  }, []);

  const refreshToken = useCallback(async () => {
    httpClient.accessToken = httpClient.refreshToken;
    try {
      const tokens = await AuthApis.refresh();
      if (tokens) {
        httpClient.accessToken = tokens?.access_token;
        httpClient.refreshToken = tokens?.refresh_token;
        dispatch({
          type: AuthActions.setUser,
          payload: {
            tokens: { accessToken: tokens?.access_token, refreshToken: tokens?.refresh_token }
          }
        });
      }
    } catch {
      dispatch({ type: AuthActions.clearUser });
    }
  }, []);

  const setTokens = useCallback((tokens) => {
    httpClient.accessToken = tokens?.access_token;
    httpClient.refreshToken = tokens?.refresh_token;
    dispatch({
      type: AuthActions.setUser,
      payload: {
        tokens: { accessToken: tokens?.access_token, refreshToken: tokens?.refresh_token }
      }
    });
  }, []);

  const register = async (email, password, firstName, lastName, organizationName) => {
    return AuthApis.signup({ email, password, firstName, lastName, organizationName });
  };

  const logout = useCallback(() => {
    dispatch({ type: AuthActions.clearUser });
  }, []);

  const resetPassword = useCallback(async (email) => {
    return AuthApis.forgetPassword(email);
  }, []);

  const getSAMLLoginUrl = useCallback(async (email) => {
    return AuthApis.getSAMLLoginUrl(email);
  }, []);

  const updateProfile = useCallback((user) => {
    dispatch({ type: AuthActions.setUser, payload: { user } });
  }, []);

  const getPermissions = useCallback(async (projectId) => {
    try {
      const permissions = await AuthApis.getPermissions(projectId);
      dispatch({ type: AuthActions.setUser, payload: { permissions } });
    } catch {
      dispatch({ type: AuthActions.clearUser });
    }
  }, []);

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshToken,
        register,
        resetPassword,
        getSAMLLoginUrl,
        updateProfile,
        getPermissions,
        setTokens,
        ssoLoginWithTokens
      }}
    >
      {initialized && children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
