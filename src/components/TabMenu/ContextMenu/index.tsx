import React, { useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useImmer } from 'use-immer';
import useContextMenu from '@/hooks/useContextMenu';
import styles from './index.less';
import BaseMenu, { BaseMenuProps } from '../BaseMenu';

export interface ContextMenuProps {
  fixed?: boolean;
  click?: (index: number, e: React.MouseEvent) => void;
  menus?: BaseMenuProps['menus'];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  menus,
  fixed,
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
  const onMenuClick: BaseMenuProps['onMenuClick'] = useCallback(
    (e, menu, index) => {
      (menu.click && menu.click(e)) || (click && click(index, e));
      setState((draft) => {
        draft.visible = false;
      });
      e.stopPropagation();
    },
    [setState],
  );

  return (
    <div ref={contentMenuRef} className={styles.menuContainer}>
      {children}
      {state.visible &&
        createPortal(
          <BaseMenu
            menus={menus}
            style={{
              position: fixed ? 'fixed' : 'absolute',
              zIndex: 100000,
              top: state.top,
              left: state.left,
            }}
            onMenuClick={onMenuClick}
          />,
          document.body,
        )}
    </div>
  );
};

export default ContextMenu;
