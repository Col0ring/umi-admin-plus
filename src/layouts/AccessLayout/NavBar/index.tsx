import React, { memo } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useLocation } from 'umi';
import { Layout, Affix } from 'antd';
import { Scrollbar } from 'react-scrollbars-custom';
import useMobile from '@/hooks/useMobile';
import setting from '@/setting';
import styles from './index.less';
import Breadcrumb from './Breadcrumb';
import TabPanes from './TabPanes';
import UserInfo from './UserInfo';
import useLayout from '@/hooks/useLayout';
import useAuth from '@/hooks/useAuth';
import { matchRoles } from '@/utils/route';

const NavBar: React.FC = () => {
  const {
    collapsed,
    breadcrumbs,
    tabPanes,
    tabKey,
    setCollapsed,
    matchedRoutes,
    setTabPanes,
  } = useLayout();

  const { isMathRoles, roles } = useAuth();

  const { pathname, search } = useLocation();
  const path = pathname + search;
  const isMobile = useMobile();
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const currentRoute = matchedRoutes[matchedRoutes.length - 1]?.route || {};

  let currentTabPanes = tabPanes;
  // 当不符合条件才判断，减少遍历
  if (!isMathRoles) {
    currentTabPanes = tabPanes.filter(({ route }) => {
      return matchRoles(roles, route.roles);
    });
  }

  return React.createElement(
    setting.navbarFixed || isMobile ? Affix : 'div',
    null,
    <div>
      <Layout.Header className={styles.navbar}>
        <div className={styles.content}>
          <div className={styles.collapse}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: styles.trigger,
                onClick: toggleCollapse,
              },
            )}
          </div>
          <div className={styles.breadcrumbContainer}>
            <Scrollbar
              className={styles.breadcrumbScrollWrapper}
              noScrollY
              removeTracksWhenNotUsed={true}
              contentProps={{
                style: {
                  height: '100%',
                },
              }}
            >
              <div className={styles.breadcrumb}>
                <Breadcrumb
                  pathname={pathname}
                  breadcrumbs={isMathRoles ? breadcrumbs : []}
                />
              </div>
            </Scrollbar>
          </div>
          <div className={styles.avatarContainer}>
            <UserInfo />
          </div>
        </div>
      </Layout.Header>
      {setting.tabsShow && (
        <TabPanes
          tabPanes={currentTabPanes}
          setTabPanes={setTabPanes}
          tabKey={tabKey}
          path={path}
          currentRoute={currentRoute}
        />
      )}
    </div>,
  );
};
export default memo(NavBar);
