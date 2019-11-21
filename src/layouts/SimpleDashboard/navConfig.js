/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import { colors } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import Label from 'src/components/Label';

export default [
  {
    subheader: 'Options',
    items: [
      {
        title: 'My Dashboard',
        href: '/dashboard',
        icon: DashboardIcon
      },
      {
        title: 'Create New',
        href: '/build',
        icon: AddIcon
      },
      {
        title: 'Code Repo',
        href: '#',
        icon: CodeIcon
      }
    ]
  }
];
