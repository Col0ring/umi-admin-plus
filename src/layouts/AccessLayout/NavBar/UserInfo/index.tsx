import React, { memo, useContext } from 'react';
import { useImmer } from 'use-immer';
import { Avatar, Dropdown, Badge, Space, Menu } from 'antd';
import {
  DownOutlined,
  BellOutlined,
  FullscreenOutlined,
  EditOutlined,
  GithubOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import useAuth from '@/hooks/useAuth';
import styles from './index.less';
import Search from '@/components/Search';
import useMobile from '@/hooks/useMobile';
import { AccessLayoutContext } from '../../Provider';

interface UserInfoDropdownProps {
  onLogout: () => void;
}

const UserInfoDropdown: React.FC<UserInfoDropdownProps> = ({ onLogout }) => {
  return (
    <Menu selectable={false}>
      <Menu.Item icon={<EditOutlined />}>修改密码</Menu.Item>
      <Menu.Item icon={<GithubOutlined />}>
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/Col0ring/umi-admin-template"
        >
          Github
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<LogoutOutlined />} onClick={onLogout}>
        退出登陆
      </Menu.Item>
    </Menu>
  );
};

const UserInfo: React.FC = () => {
  const [state, setState] = useImmer({
    dropDownVisible: false,
  });

  const { resetUser } = useAuth();
  const isMobile = useMobile();
  const { toggleFull } = useContext(AccessLayoutContext);

  const onVisibleChange = (visible: boolean) => {
    setState((draft) => {
      draft.dropDownVisible = visible;
    });
  };

  const onLogout = () => {
    resetUser();
  };

  const iconClassName = classnames(styles.icon, {
    [styles.open]: state.dropDownVisible,
  });
  return (
    <div className={styles.globalHeaderContainer}>
      <div className={styles.tools}>
        <Space size="middle">
          <Search collapsed={isMobile} />
          <Badge dot>
            <BellOutlined />
          </Badge>
          <FullscreenOutlined onClick={toggleFull} />
        </Space>
      </div>
      <Dropdown
        visible={state.dropDownVisible}
        arrow
        overlay={<UserInfoDropdown onLogout={onLogout} />}
        onVisibleChange={onVisibleChange}
      >
        <div className={styles.avatarContainer}>
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            size="large"
            alt="头像"
          />
          <DownOutlined className={iconClassName} />
        </div>
      </Dropdown>
    </div>
  );
};

export default memo(UserInfo);
