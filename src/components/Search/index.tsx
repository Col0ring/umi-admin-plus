import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';
export interface SearchProps {
  collapsed?: boolean;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({
  collapsed,
  className,
  onChange,
  value,
}) => {
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBoxClassName = classnames(styles.searchBox, className, {
    [styles.md]: collapsed,
    [styles.active]: active,
  });
  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);
  return (
    <div className={styles.search}>
      <div className={styles.search}>
        <div className={searchBoxClassName}>
          <SearchOutlined
            className={styles.searchIcon}
            onClick={() => {
              setActive(active => !active);
            }}
          />
          <input
            value={value}
            onChange={e => {
              onChange && onChange(e.target.value);
            }}
            ref={inputRef}
            onBlur={() => {
              setActive(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
