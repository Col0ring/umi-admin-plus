import React from 'react';
import { Layout } from 'antd';
import { IRouteComponentProps, IRoute } from 'umi';
import SiderBar from './SiderBar';
import MainContent from './MainContent';
import NavBar from './NavBar';
import LayoutFooter from './LayoutFooter';
import useMobile from '@/hooks/useMobile';
import useLayout from '@/hooks/useLayout';
import useAuth from '@/hooks/useAuth';
import ForbiddenPage from '@/components/403';
import PageLoading from '@/components/PageLoading';

const AccessLayout: React.FC<IRouteComponentProps> = (props) => {
  const {
    location: { pathname },
    route: { routes },
    children,
  } = props;
  const { collapsed, openKeys, selectedKey, isNotFound, loading } = useLayout();
  const { isMathRoles } = useAuth();
  const isMobile = useMobile();
  return (
    <div className="umi-admin-layout">
      <Layout
        style={{
          minHeight: '100vh',
          paddingLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: 'all 0.2s',
        }}
      >
        <SiderBar
          pathname={pathname}
          selectedKey={selectedKey}
          openKeys={openKeys}
          menus={(routes as IRoute[]) || []}
        />
        <Layout>
          <NavBar />
          <MainContent>
            {loading ? (
              <PageLoading tip="加载中..." />
            ) : isMathRoles || isNotFound ? (
              children
            ) : (
              <ForbiddenPage />
            )}
          </MainContent>
          <LayoutFooter />
        </Layout>
      </Layout>
    </div>
  );
};

export default AccessLayout;
