import React, { useEffect, useMemo } from 'react';
import { Redirect, matchPath, useLocation, useDispatch } from 'umi';
import { whitePageList, noLoginPageList } from '@/router';
import PageLoading from '@/components/PageLoading';
import useAuth from '@/hooks/useAuth';

const AuthWrapper: React.FC = ({ children }) => {
  const { isLogin, user } = useAuth();
  const { pathname, search } = useLocation();
  const dispatch = useDispatch();

  const isWhiteListPage = useMemo(
    () =>
      whitePageList.some(path => {
        return matchPath(pathname, { path, exact: true });
      }),
    [pathname],
  );
  const isNoLoginPage = useMemo(
    () =>
      noLoginPageList.some(path => {
        return matchPath(pathname, { path, exact: true });
      }),
    [pathname],
  );

  // 必须在 useEffect 中请求，否则会有渲染错误
  useEffect(() => {
    if (isLogin && !user) {
      dispatch({
        type: 'permission/getUserInfo',
      });
    }
  }, [pathname]);

  if (isLogin) {
    if (isNoLoginPage) {
      return <Redirect to="/" />;
    }
    if (user) {
      return <>{children}</>;
    } else {
      return <PageLoading tip="正在获取用户信息" />;
    }
  } else {
    if (isWhiteListPage) {
      return <>{children}</>;
    } else {
      return (
        <Redirect
          to={{ pathname: '/login', search: `?redirect=${pathname + search}` }}
        />
      );
    }
  }
};

export default AuthWrapper;
