import React from 'react'
import {
  SiderMenuHomeIcon,
  SiderMenuDashboardIcon,
  SiderMenuBasicIcon,
  SiderMenuWidgetIcon,
  SiderMenuProductIcon,
  SiderMenuPurchaseIcon,
  SiderMenuSaleIcon
} from '../icon/Icon'

export const routes = [
  {
    path: '/Report/Purchase',
    title: '進貨單 - 報表'
  },
  {
    path: '/Report/Sale',
    title: '銷貨單 - 報表'
  },
  {
    path: '/Report',
    title: '報表'
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
    path: '/Products/QuickEdit',
    title: '快速編修 - 商品管理'
  },
  {
    path: '/Products/Add',
    title: '新增 - 商品管理'
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
    path: '/Purchase/Add',
    title: '新增 - 進貨單'
  },
  {
    path: '/Purchase',
    title: '進貨單'
  },
  {
    path: '/Sale/List',
    title: '列表 - 銷貨單'
  },
  {
    path: '/Sale/Add',
    title: '新增 - 銷貨單'
  },
  {
    path: '/Sale',
    title: '銷貨單'
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
    key: 'Report',
    routes: ['Report'],
    icon: <SiderMenuDashboardIcon />,
    title: '報表',
    accessRoles: ['ROLE_REPORT'],
    children: [
      {
        key: 'ReportPurchase',
        routes: ['Report', 'Purchase'],
        title: '進貨單報表',
        accessRoles: ['ROLE_PURCHASE_REPORT']
      },
      {
        key: 'ReportSale',
        routes: ['Report', 'Sale'],
        title: '銷貨單報表',
        accessRoles: ['ROLE_SALES_REPORT']
      }
    ]
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
        key: 'ProductsQuickEdit',
        routes: ['Products', 'QuickEdit'],
        title: '快速編修',
        accessRoles: ['ROLE_PRODUCT_UPDATE']
      },
      {
        key: 'ProductsAdd',
        routes: ['Products', 'Add'],
        title: '新增商品',
        accessRoles: [],
        hidden: true
      }
    ]
  },
  {
    key: 'Purchase',
    routes: ['Purchase'],
    icon: <SiderMenuPurchaseIcon />,
    title: '進貨',
    accessRoles: ['ROLE_PURCHASE_MENU'],
    children: [
      {
        key: 'PurchaseList',
        routes: ['Purchase', 'List'],
        title: '列表',
        accessRoles: ['ROLE_PURCHASE_LIST']
      },
      {
        key: 'PurchaseAdd',
        routes: ['Purchase', 'Add'],
        title: '新增',
        accessRoles: ['ROLE_PRODUCT_ADD']
      },
      {
        key: 'PurchaseDetail',
        routes: ['Purchase', 'Detail'],
        title: '修改進貨單資料',
        accessRoles: [],
        hidden: true
      }
    ]
  },
  {
    key: 'Sale',
    routes: ['Sale'],
    icon: <SiderMenuSaleIcon />,
    title: '銷貨',
    accessRoles: ['ROLE_SALES_MENU'],
    children: [
      {
        key: 'SaleList',
        routes: ['Sale', 'List'],
        title: '列表',
        accessRoles: ['ROLE_SALES_LIST']
      },
      {
        key: 'SaleAdd',
        routes: ['Sale', 'Add'],
        title: '新增',
        accessRoles: ['ROLE_SALES_ADD']
      },
      {
        key: 'SaleDetail',
        routes: ['Sale', 'Detail'],
        title: '修改銷貨單資料',
        accessRoles: [],
        hidden: true
      }
    ]
  }
]
