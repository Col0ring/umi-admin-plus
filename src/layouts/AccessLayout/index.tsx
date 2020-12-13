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

const AccessLayout: React.FC<IRouteComponentProps> = props => {
  const {
    location: { pathname },
    route: { routes },
    children,
  } = props;
  const { collapsed } = useLayout();
  const { isMathRoles } = useAuth();

  const isMobile = useMobile();
  const { openKeys, selectedKey } = useLayout();
  return (
    <div className="umi-admin-layout">
      <Layout
        style={{
          minHeight: '100vh',
          paddingLeft: isMobile ? (collapsed ? 80 : 200) : 0,
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
            {isMathRoles ? children : <ForbiddenPage />}
          </MainContent>
          <LayoutFooter />
        </Layout>
      </Layout>
    </div>
  );
};

export default AccessLayout;
