import { createContext, useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { SIGN_IN } from '../constants/constants';
import { getNewToken } from '../services/users-service';
import { setToken } from '../lib/axios';
import axios from '../lib/axios';

const AuthContext = createContext({
  token: '',
  username: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  changeUserName: (username) => {},
});

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const data = localStorage.getItem('userInfo');

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  });
  const token = userInfo?.token;
  const userIsLoggedIn = !!token;
  const username = userInfo?.username;
  const navigate = useNavigate();

  useEffect(() => {
    setToken(userInfo?.token);
  }, [userInfo?.token]);

  const loginHandler = useCallback((data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  }, []);

  const logoutHandler = useCallback(() => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  }, []);
  const changeUserNameHandler = useCallback(
    (username) => {
      setUserInfo({
        ...userInfo,
        username,
      });
    },
    [userInfo]
  );

  const handleRefreshToken = useCallback(async () => {
    if (!userInfo?.refreshToken) {
      return;
    }

    try {
      const { data } = await getNewToken(userInfo.refreshToken);
      const newUserInfo = {
        ...userInfo,
        token: data.token,
      };

      loginHandler(newUserInfo);
    } catch (e) {
      console.error(e);
      logoutHandler();
      navigate(SIGN_IN);
    }
  }, [loginHandler, logoutHandler, navigate, userInfo]);

  useEffect(() => {
    function handleUnauthorizedError(error) {
      if (error.response.data.status === 401) {
        return new Promise((resolve, reject) => {
          handleRefreshToken().then(() => reject(error));
        });
      }

      return Promise.reject(error);
    }

    const myInterceptor = axios.interceptors.response.use(
      (response) => response,
      handleUnauthorizedError
    );

    return () => {
      axios.interceptors.response.eject(myInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    username: username,
    id: userInfo?.userId,
    login: loginHandler,
    logout: logoutHandler,
    changeUserName: changeUserNameHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
