import React from 'react';
import { Space } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
export interface MenuItemProps {
  click?: (e?: React.MouseEvent) => void;
  icon?: React.ReactNode;
  name?: string;
  render?: React.ReactNode;
}
export interface BaseMenuProps {
  menus?: MenuItemProps[];
  style?: React.CSSProperties;
  className?: string;
  onMenuClick?: (
    e: React.MouseEvent,
    menu: MenuItemProps,
    index: number,
  ) => void;
}

const BaseMenu: React.FC<BaseMenuProps> = ({
  menus,
  style,
  className,
  onMenuClick,
}) => {
  const menuClassName = classnames(styles.menu, className);
  return (
    <div style={style} className={menuClassName}>
      {menus &&
        menus.map((menu, index) => {
          if (menu.render && typeof menu.render === 'function') {
            return menu.render();
          }
          const onClick = (e: React.MouseEvent) => {
            onMenuClick && onMenuClick(e, menu, index);
          };

          return (
            <div onClick={onClick} key={index} className={styles.item}>
              <Space size="middle">
                {menu.icon}
                <span>{menu.name}</span>
              </Space>
            </div>
          );
        })}
    </div>
  );
};

export default BaseMenu;
