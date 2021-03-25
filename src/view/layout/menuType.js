import React from 'react'
import { SiderMenuHomeIcon, SiderMenuDashboardIcon, SiderMenuBasicIcon } from '../icon/Icon'

export const menuType = [
  {
    key: 'Home',
    routes: [''],
    icon: <SiderMenuHomeIcon />,
    title: '首頁',
    accessRoles: []
  },
  {
    key: 'Dashboard',
    routes: ['Dashboard'],
    icon: <SiderMenuDashboardIcon />,
    title: '儀表板',
    accessRoles: []
  },
  {
    key: 'Basic',
    routes: ['Basic'],
    icon: <SiderMenuBasicIcon />,
    title: '基本資料',
    accessRoles: [],
    children: [
      {
        key: 'Supplier',
        routes: ['Basic', 'Supplier'],
        title: '廠商',
        accessRoles: []
      },
      {
        key: 'Customer',
        routes: ['Basic', 'Customer'],
        title: '客戶',
        accessRoles: []
      },
      {
        key: 'Employee',
        routes: ['Basic', 'Employee'],
        title: '員工',
        accessRoles: []
      }
    ]
  }
]
