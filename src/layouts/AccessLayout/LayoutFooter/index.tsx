import React, { memo } from 'react';
import styles from './index.less';

const LayoutFooter: React.FC = () => {
  return <div className={styles.globalFooter}>Umi Admin © 2020</div>;
};

export default memo(LayoutFooter);
