import React from 'react';
import ContextMenu from '@/components/TabMenu/ContextMenu';
import useTabMenu, { TabMenuOptions } from '@/hooks/useTabMenu';
import setting from '@/setting';

const TabPaneContextMenu: React.FC<TabMenuOptions> = ({
  tabPanes,
  pathKey,
  keeperKey,
  children,
  path,
  setTabPanes,
}) => {
  const tabMenus = useTabMenu({
    tabPanes,
    pathKey,
    keeperKey,
    path,
    setTabPanes,
  });
  return (
    <ContextMenu fixed={setting.navbarFixed} menus={tabMenus}>
      {children}
    </ContextMenu>
  );
};

export default TabPaneContextMenu;
