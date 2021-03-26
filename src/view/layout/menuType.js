import React from 'react'
import {
  SiderMenuHomeIcon,
  SiderMenuDashboardIcon,
  SiderMenuBasicIcon,
  SiderMenuWidgetIcon
} from '../icon/Icon'

export const menuType = [
  // {
  //   key: 'Home',
  //   routes: [''],
  //   icon: <SiderMenuHomeIcon />,
  //   title: '首頁',
  //   accessRoles: []
  // },
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
    accessRoles: ['ROLE_BASIC_MENU'],
    children: [
      {
        key: 'Supplier',
        routes: ['Basic', 'Supplier'],
        title: '廠商',
        accessRoles: ['ROLE_VENDOR']
      },
      {
        key: 'Customer',
        routes: ['Basic', 'Customer'],
        title: '客戶',
        accessRoles: ['ROLE_CUSTOMER']
      },
      {
        key: 'Employee',
        routes: ['Basic', 'Employee'],
        title: '員工',
        accessRoles: ['ROLE_EMPLOYEE']
      }
    ]
  },
  {
    key: 'Parts',
    routes: ['Parts'],
    icon: <SiderMenuWidgetIcon />,
    title: '零件管理',
    accessRoles: ['ROLE_PART_MENU'],
    children: [
      {
        key: 'Vehicle',
        routes: ['Parts', 'Vehicle'],
        title: '車種',
        accessRoles: ['ROLE_KIND']
      },
      {
        key: 'Level',
        routes: ['Parts', 'Level'],
        title: '等級',
        accessRoles: ['ROLE_GRADE']
      },
      {
        key: 'Colour',
        routes: ['Parts', 'Colour'],
        title: '顏色',
        accessRoles: ['ROLE_COLOR']
      },
      {
        key: 'Component',
        routes: ['Parts', 'Component'],
        title: '零件',
        accessRoles: ['ROLE_PART']
      }
    ]
  }
]
