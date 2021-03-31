import React from 'react'
import { Drawer } from 'antd'

export const PageDrawer = (props) => {
  return <Drawer {...props} className='layout-content-drawer-wrapper'>{props.children}</Drawer>
}
