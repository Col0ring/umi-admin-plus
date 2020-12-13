import React from 'react';
import * as AllIcons from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

export interface TotalIconsProps extends AntdIconProps {
  name: string;
}

const TotalIcons: React.FC<TotalIconsProps> = ({ name, ...rest }) => {
  return name
    ? React.createElement((AllIcons as GlobalObject)[name], {
        ...rest,
      })
    : null;
};

export default TotalIcons;
