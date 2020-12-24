import React, { useMemo, useCallback } from 'react';
import { useHistory, useAliveController } from 'umi';
import {
  CloseCircleOutlined,
  CloseOutlined,
  CloseSquareOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  ReloadOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import pathToRegexp from 'path-to-regexp';
import ContextMenu, { MenuItemProps } from '@/components/ContextMenu';
import { LayoutData } from '@/interfaces/Layout';
import useCloseTab from '@/hooks/useCloseTab';
import useLayout from '@/hooks/useLayout';

export interface TabPaneContextMenuProps {
  // all tab panes
  tabPanes: LayoutData['tabPanes'];
  // push to
  pathKey: string;
  // keep key
  keeperKey: string | RegExp;
  // current pathname
  path: string;
}

const TabPaneContextMenu: React.FC<TabPaneContextMenuProps> = ({
  tabPanes,
  pathKey,
  keeperKey,
  children,
  path,
}) => {
  const history = useHistory();
  const { setTabPanes } = useLayout();
  const { dropScope, clear, refreshScope } = useAliveController();
  const closeItem = useCloseTab(tabPanes, path);

  // 转换为正则
  keeperKey = pathToRegexp(keeperKey);
  const contextMenu: MenuItemProps[] = useMemo(
    () => [
      {
        icon: <RedoOutlined />,
        name: '刷新',
        click: () => {
          if (path !== pathKey) {
            dropScope(keeperKey).then(() => {
              history.push(pathKey);
            });
          } else {
            refreshScope(keeperKey);
          }
        },
      },
      {
        icon: <ReloadOutlined />,
        name: '刷新全部',
        click: () => {
          clear();
          refreshScope(keeperKey);
        },
      },
      {
        icon: <CloseOutlined />,
        name: '关闭',
        click: () => {
          closeItem(pathKey);
        },
      },
      {
        icon: <CloseCircleOutlined />,
        name: '关闭所有',
        click: () => {
          clear();
          setTabPanes([]);
          history.push('/');
          clear().then(() => {
            const unListen = history.listen(() => {
              unListen && unListen();
              setTimeout(() => {
                clear();
              }, 60);
            });
          });
        },
      },
      {
        icon: <CloseSquareOutlined />,
        name: '关闭其他',
        click: () => {
          const currentPanes = tabPanes.filter(
            pane => pane.route.realPath === pathKey,
          );
          setTabPanes(currentPanes);
          if (path === pathKey) {
            clear();
          } else {
            history.push(pathKey);
            const unListen = history.listen(() => {
              unListen && unListen();
              setTimeout(() => {
                clear();
              }, 60);
            });
          }
        },
      },
      {
        icon: <VerticalRightOutlined />,
        name: '关闭左侧',
        click: () => {
          const pathIndex = tabPanes.findIndex(
            pane => pane.route.realPath === path,
          );
          const currentIndex = tabPanes.findIndex(
            pane => pane.route.realPath === pathKey,
          );
          const currentPanes = tabPanes.slice(currentIndex);
          const closePanes = tabPanes.slice(0, currentIndex);
          setTabPanes(currentPanes);
          closePanes.forEach(pane => {
            dropScope(pane.route.keeperKey);
          });
          if (pathIndex < currentIndex) {
            history.push(pathKey);
            const unListen = history.listen(() => {
              unListen && unListen();
              setTimeout(() => {
                dropScope(
                  closePanes.find(pane => pane.route.realPath === path)?.route
                    .keeperKey || path,
                );
              }, 60);
            });
          }
        },
      },
      {
        icon: <VerticalLeftOutlined />,
        name: '关闭右侧',
        click: () => {
          const pathIndex = tabPanes.findIndex(
            pane => pane.route.realPath === path,
          );
          const currentIndex = tabPanes.findIndex(
            pane => pane.route.realPath === pathKey,
          );
          const currentPanes = tabPanes.slice(0, currentIndex + 1);
          const closePanes = tabPanes.slice(currentIndex + 1);
          setTabPanes(currentPanes);
          closePanes.forEach(pane => {
            dropScope(pane.route.keeperKey);
          });
          if (pathIndex < 0 || pathIndex > currentIndex) {
            history.push(pathKey);
            const unListen = history.listen(() => {
              unListen && unListen();
              setTimeout(() => {
                dropScope(
                  closePanes.find(pane => pane.route.realPath === path)?.route
                    .keeperKey || path,
                );
              }, 60);
            });
          }
        },
      },
    ],
    [tabPanes, setTabPanes, pathKey, keeperKey, path],
  );
  return <ContextMenu menus={contextMenu}>{children}</ContextMenu>;
};

export default TabPaneContextMenu;
