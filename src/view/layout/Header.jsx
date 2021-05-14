import React from 'react'
import { Input, Button } from 'antd'
import {
  HeaderNotifyEmptyIcon,
  HeaderNotifyExistIcon,
  HeaderLogoutIcon,
  HeaderAccountIcon
} from '../icon/Icon'

export const LayoutHeader = (props) => {
  return (
    <>
      <div className='layout-header-left'>
        {/* <Input.Search placeholder='全域搜尋' enterButton /> */}
      </div>
      <div className='layout-header-right'>
        <Button>
          <HeaderNotifyEmptyIcon />
        </Button>
        <Button onClick={props.onLogout}>
          <HeaderLogoutIcon />
        </Button>
        <Button className='layout-header-account'>
          <HeaderAccountIcon />
        </Button>
      </div>
    </>
  )
}
