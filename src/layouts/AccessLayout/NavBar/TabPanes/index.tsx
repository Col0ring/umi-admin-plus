import React, { memo, useCallback } from 'react';
import classnames from 'classnames';
import { useHistory } from 'umi';
import { Tabs, Space } from 'antd';
import { TabsProps } from 'antd/es/tabs';
import { CloseCircleOutlined } from '@ant-design/icons';
import useCloseTab from '@/hooks/useCloseTab';
import TotalIcons from '@/components/TotalIcons';
import TabPaneContextMenu from './TabPaneContextMenu';
import styles from './index.less';
import { LayoutData, MatchedRoute } from '@/interfaces/Layout';
import OperationButton from './OperationButton';

export interface TabPaneProps {
  currentRoute: MatchedRoute['route'];
  // current pathname
  path: string;
  tabPanes: LayoutData['tabPanes'];
  setTabPanes: (tabPanes: LayoutData['tabPanes']) => void;
  // active key
  tabKey: string;
}

const TabPanes: React.FC<TabPaneProps> = ({
  path,
  tabPanes,
  tabKey,
  currentRoute,
  setTabPanes,
}) => {
  const history = useHistory();
  const close = useCloseTab(tabPanes, path);
  const onPaneClose = useCallback(
    (key: string) => {
      close(key);
    },
    [close],
  );
  const onTabClick: TabsProps['onTabClick'] = useCallback(
    (key) => {
      if (tabKey === key) return;
      history.replace(key);
    },
    [tabKey, history],
  );

  return (
    <div className={styles.headerTabPane}>
      <Tabs
        activeKey={tabKey}
        onTabClick={onTabClick}
        type="card"
        hideAdd
        tabBarStyle={{ margin: 0 }}
        tabBarExtraContent={{
          right: (
            <OperationButton
              setTabPanes={setTabPanes}
              tabPanes={tabPanes}
              path={path}
              keeperKey={currentRoute.keeperKey}
              pathKey={currentRoute.realPath}
            />
          ),
        }}
      >
        {tabPanes.map(({ route }) => {
          const tabName = route.tabName || route.name;
          const closeClassName = classnames(styles.closeIcon, {
            [styles.open]: tabKey === route.realPath,
          });
          return route.hideInTabs || !tabName ? null : (
            <Tabs.TabPane
              key={route.realPath}
              tab={
                <TabPaneContextMenu
                  path={path}
                  pathKey={route.realPath}
                  setTabPanes={setTabPanes}
                  tabPanes={tabPanes}
                  keeperKey={route.keeperKey}
                >
                  <Space className={styles.pane}>
                    <div>
                      {route.icon && <TotalIcons name={route.icon} />}
                      <span>{tabName}</span>
                    </div>
                    <CloseCircleOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        onPaneClose(route.realPath);
                      }}
                      className={closeClassName}
                    />
                  </Space>
                </TabPaneContextMenu>
              }
            />
          );
        })}
      </Tabs>
    </div>
  );
};

export default memo(TabPanes);
