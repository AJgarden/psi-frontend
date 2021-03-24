import React from 'react'
import { SiderMenuDashboardIcon, SiderMenuBasicIcon } from '../icon/Icon'

export const menuType = [
  {
    key: 'Dashboard',
    routes: ['Dashboard'],
    icon: <SiderMenuDashboardIcon />,
    title: 'Dashboard',
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
