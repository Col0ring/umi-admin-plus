import React, { useRef } from 'react';
import { Layout } from 'antd';
import { useFullscreen } from 'ahooks';
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
import { AccessLayoutContext } from './Provider';

const AccessLayout: React.FC<IRouteComponentProps> = (props) => {
  const {
    location: { pathname },
    route: { routes },
    children,
  } = props;
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const { collapsed, openKeys, selectedKey, isNotFound, loading } = useLayout();
  const { isMathRoles } = useAuth();
  const isMobile = useMobile();
  const [isFull, { toggleFull }] = useFullscreen(layoutRef);
  return (
    <AccessLayoutContext.Provider
      value={{
        isFull,
        toggleFull,
      }}
    >
      <div ref={layoutRef} className="umi-admin-layout">
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
    </AccessLayoutContext.Provider>
  );
};

export default AccessLayout;
