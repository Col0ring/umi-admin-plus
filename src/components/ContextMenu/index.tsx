import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useImmer } from 'use-immer';
import { Space } from 'antd';
import useContextMenu from '@/hooks/useContextMenu';
import styles from './index.less';
import setting from '@/setting';

export interface MenuItemProps {
  click?: (e?: React.MouseEvent) => void;
  icon?: React.ReactNode;
  name?: string;
  render?: React.ReactNode;
}
export interface ContextMenuProps {
  click?: (index: number, e: React.MouseEvent) => void;
  menus?: MenuItemProps[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menus,
  click,
}) => {
  const contentMenuRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useImmer({
    visible: false,
    top: 0,
    left: 0,
  });

  useContextMenu(contentMenuRef, {
    click: (e) => {
      setState((draft) => {
        draft.visible = true;
        if (e.clientX + 140 > window.innerWidth) {
          draft.left = e.clientX - 152;
        } else {
          draft.left = e.clientX + 12;
        }
        draft.top = e.clientY + 10;
      });
    },
    clickAway: () => {
      setState((draft) => {
        draft.visible = false;
      });
    },
  });

  return (
    <div ref={contentMenuRef} className={styles.menuContainer}>
      {children}
      {state.visible &&
        createPortal(
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: setting.navbarFixed ? 'fixed' : 'absolute',
              top: state.top,
              left: state.left,
            }}
            className={styles.contextMenu}
          >
            {menus &&
              menus.map((menu, index) => {
                if (menu.render && typeof menu.render === 'function') {
                  return menu.render();
                }
                const onClick = (e: React.MouseEvent) => {
                  (menu.click && menu.click(e)) || (click && click(index, e));
                  setState((draft) => {
                    draft.visible = false;
                  });
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
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ContextMenu;
