import React from 'react'
import {
  SiderMenuHomeIcon,
  SiderMenuDashboardIcon,
  SiderMenuBasicIcon,
  SiderMenuWidgetIcon,
  SiderMenuProductIcon,
  SiderMenuPurchaseIcon
} from '../icon/Icon'

export const routes = [
  {
    path: '/Dashboard',
    title: '儀表板'
  },
  {
    path: '/Basic/Supplier',
    title: '廠商 - 基本資料'
  },
  {
    path: '/Basic/Customer',
    title: '客戶 - 基本資料'
  },
  {
    path: '/Basic/Employee',
    title: '員工 - 基本資料'
  },
  {
    path: '/Basic',
    title: '基本資料'
  },
  {
    path: '/Parts/Vehicle',
    title: '車種 - 零件管理'
  },
  {
    path: '/Parts/Level',
    title: '等級 - 零件管理'
  },
  {
    path: '/Parts/Colour',
    title: '顏色 - 零件管理'
  },
  {
    path: '/Parts/Component',
    title: '零件 - 零件管理'
  },
  {
    path: '/Parts',
    title: '零件管理'
  },
  {
    path: '/Products/List',
    title: '列表 - 商品管理'
  },
  {
    path: '/Products',
    title: '商品管理'
  },
  {
    path: '/Purchase/List',
    title: '列表 - 進貨單'
  },
  {
    path: '/Purchase',
    title: '進貨單'
  },
  {
    path: '/',
    title: '首頁'
  }
]

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
        key: 'BasicSupplier',
        routes: ['Basic', 'Supplier'],
        title: '廠商',
        accessRoles: ['ROLE_VENDOR']
      },
      {
        key: 'BasicCustomer',
        routes: ['Basic', 'Customer'],
        title: '客戶',
        accessRoles: ['ROLE_CUSTOMER']
      },
      {
        key: 'BasicEmployee',
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
        key: 'PartsVehicle',
        routes: ['Parts', 'Vehicle'],
        title: '車種',
        accessRoles: ['ROLE_KIND']
      },
      {
        key: 'PartsLevel',
        routes: ['Parts', 'Level'],
        title: '等級',
        accessRoles: ['ROLE_GRADE']
      },
      {
        key: 'PartsColour',
        routes: ['Parts', 'Colour'],
        title: '顏色',
        accessRoles: ['ROLE_COLOR']
      },
      {
        key: 'PartsComponent',
        routes: ['Parts', 'Component'],
        title: '零件',
        accessRoles: ['ROLE_PART']
      }
    ]
  },
  {
    key: 'Products',
    routes: ['Products'],
    icon: <SiderMenuProductIcon />,
    title: '商品管理',
    accessRoles: ['ROLE_PRODUCT_MENU'],
    children: [
      {
        key: 'ProductsList',
        routes: ['Products', 'List'],
        title: '列表',
        accessRoles: ['ROLE_PRODUCT']
      },
      {
        key: 'ProductsImport',
        routes: ['Products', 'Import'],
        title: '匯入',
        accessRoles: ['ROLE_PRODUCT_IMPORT']
      }
    ]
  },
  {
    key: 'PurchaseL',
    routes: ['Purchase', 'List'],
    icon: <SiderMenuPurchaseIcon />,
    title: '進貨',
    accessRoles: ['ROLE_PURCHASE_MENU']
  }
]
