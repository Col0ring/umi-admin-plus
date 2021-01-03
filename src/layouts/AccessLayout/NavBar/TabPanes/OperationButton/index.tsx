import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import useTabMenu, { TabMenuOptions } from '@/hooks/useTabMenu';
import BaseMenu from '@/components/TabMenu/BaseMenu';

const OperationButton: React.FC<TabMenuOptions> = ({
  path,
  tabPanes,
  keeperKey,
  pathKey,
  setTabPanes,
}) => {
  const [visible, setVisible] = useState(false);
  const tabMenus = useTabMenu({
    pathKey,
    path,
    keeperKey,
    tabPanes,
    setTabPanes,
  });

  return (
    <Dropdown.Button
      onVisibleChange={setVisible}
      visible={visible}
      overlay={
        <BaseMenu
          menus={tabMenus}
          // 不能是 onClick，会被 overlay 拦截，因为 overlay 本身是只能传 Menu 的
          onMenuClick={(e, menu, index) => {
            menu.click && menu.click();
            setVisible(false);
          }}
        />
      }
      placement="bottomRight"
      icon={<DeploymentUnitOutlined />}
    />
  );
};

export default OperationButton;
