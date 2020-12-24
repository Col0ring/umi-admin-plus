import React, { useEffect, useMemo } from 'react';
import { Redirect, matchPath, useLocation, useDispatch } from 'umi';
import { whitePageList, noLoginPageList } from '@/router';
import useAuth from '@/hooks/useAuth';
import PageLoading from '@/components/PageLoading';
import NotFoundPage from '@/components/404';
import ForbiddenPage from '@/components/403';
import useLayout from '@/hooks/useLayout';

const AuthWrapper: React.FC = ({ children }) => {
  const { isLogin, user, isMathRoles } = useAuth();
  const { inLayout, isNotFound } = useLayout();

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
      if (!isMathRoles && isNotFound) {
        return <NotFoundPage />;
      }
      if (!isMathRoles && !isWhiteListPage && !inLayout) {
        return <ForbiddenPage />;
      }
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
