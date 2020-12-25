import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { Link, IRoute } from 'umi';
import classnames from 'classnames';
import { useImmer } from 'use-immer';
import { Menu, Layout, Drawer } from 'antd';
import { MenuProps } from 'antd/es/menu';
import TotalIcons from '@/components/TotalIcons';
import useMobile from '@/hooks/useMobile';
import Logo from './Logo';
import { matchRoles } from '@/utils/route';
import { urlReg } from '@/utils/validators';
import setting from '@/setting';
import useAuth from '@/hooks/useAuth';
import styles from './index.less';
import useLayout from '@/hooks/useLayout';
import { LayoutRoute } from '@/interfaces/Layout';

interface SiderBarProps {
  menus: IRoute[];
  selectedKey: string;
  openKeys: string[];
  pathname: string;
}

const SiderBar: React.FC<SiderBarProps> = ({
  menus,
  selectedKey,
  openKeys: savedOpenKeys,
  pathname,
}) => {
  const isMobile = useMobile();
  const { roles } = useAuth();
  const { collapsed, setCollapsed } = useLayout();

  const renderMenu = useCallback(
    (menu: LayoutRoute): React.ReactNode => {
      const realPath = menu.externalPath || menu.redirect || menu.path;
      if (
        matchRoles(roles, menu.roles) &&
        !menu.hideInMenu &&
        menu.name &&
        realPath
      ) {
        const key = menu.key || menu.externalPath || menu.path;
        if (!key) {
          return null;
        }
        if (!menu.hideChildrenInMenu && menu.routes && menu.routes.length > 0) {
          return (
            <Menu.SubMenu
              key={key}
              icon={menu.icon && <TotalIcons name={menu.icon} />}
              title={menu.name}
            >
              {renderMenus(menu.routes)}
            </Menu.SubMenu>
          );
        }

        return (
          <Menu.Item key={key}>
            {urlReg.test(realPath) ? (
              <a href={realPath} target="_blank" rel="noopener noreferrer">
                {menu.icon && <TotalIcons name={menu.icon} />}
                <span>{menu.name}</span>
              </a>
            ) : (
              <Link to={realPath}>
                {menu.icon && <TotalIcons name={menu.icon} />}
                <span>{menu.name}</span>
              </Link>
            )}
          </Menu.Item>
        );
      } else {
        return null;
      }
    },
    [roles],
  );

  const renderMenus = useCallback(
    (menus: IRoute[]) => {
      return menus.map((menu) => {
        return renderMenu(menu);
      });
    },
    [renderMenu],
  );

  const [state, setState] = useImmer({
    openKeys: [] as string[],
    collapsedOpenKeys: [] as string[],
  });

  const toggleCollapse = useCallback(
    (broken: boolean) => {
      setCollapsed(broken);
    },
    [setCollapsed],
  );

  const onOpenChange: MenuProps['onOpenChange'] = useCallback(
    (keys) => {
      //  在collapse关闭的时候会变为空数组
      if (collapsed) {
        setState((draft) => {
          draft.collapsedOpenKeys = keys as string[];
        });
      } else {
        setState((draft) => {
          draft.openKeys = keys as string[];
        });
      }
    },
    [collapsed, setState],
  );

  const onDrawerClose = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  useEffect(() => {
    setState((draft) => {
      const openKeys = [...new Set([...draft.openKeys, ...savedOpenKeys])];
      draft.openKeys = openKeys;
    });
  }, [savedOpenKeys]);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [pathname, isMobile]);

  const siderBarClassName = classnames(styles.siderBar, {
    [styles.fixed]: !isMobile,
  });

  const renderSider = useMemo(() => {
    return (
      <Layout.Sider
        className={siderBarClassName}
        trigger={null}
        collapsedWidth={isMobile ? 0 : 80}
        collapsible
        breakpoint="md"
        collapsed={isMobile ? false : collapsed}
        onBreakpoint={isMobile ? undefined : toggleCollapse}
      >
        {setting.logoShow && <Logo title={setting.title} logo={setting.logo} />}

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={
            collapsed && !isMobile ? state.collapsedOpenKeys : state.openKeys
          }
          theme="dark"
          onOpenChange={onOpenChange}
        >
          {renderMenus(menus)}
        </Menu>
      </Layout.Sider>
    );
  }, [
    siderBarClassName,
    isMobile,
    collapsed,
    toggleCollapse,
    onOpenChange,
    menus,
    state.collapsedOpenKeys,
    state.openKeys,
    selectedKey,
  ]);

  return isMobile ? (
    <Drawer
      bodyStyle={{ padding: 0 }}
      width={200}
      closable={false}
      placement="left"
      forceRender
      getContainer={false}
      visible={!collapsed}
      onClose={onDrawerClose}
    >
      {renderSider}
    </Drawer>
  ) : (
    renderSider
  );
};

export default memo(SiderBar);
