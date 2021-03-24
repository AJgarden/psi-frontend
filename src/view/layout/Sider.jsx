import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { menuType } from './menuType'

export const LayoutSider = (props) => {
  const [selectedKeys, setSelectedKeys] = useState([])
  useEffect(() => {
    if (props.match.params.page !== undefined) {
      setSelectedKeys(['Dashboard'])
    } else {
      setSelectedKeys([props.match.params.page])
    }
  }, [])

  return (
    <>
      <h1 className='layout-sider-logo'>
        <Link to='/'>
          <span className='layout-sider-logo-f'>
            MOTOBUY
            <br />
            PSI
          </span>
          <span className='layout-sider-logo-s'>M</span>
        </Link>
      </h1>
      <Menu className='layout-sider-menu' defaultSelectedKeys={selectedKeys}>
        {menuType.map((menu) => {
          return menu.children && menu.children.length > 0 ? (
            // <Menu.Item key={menu.key} icon={menu.icon}>
            //   {menu.title}
            // </Menu.Item>
            <Menu.SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
              {menu.children.map((children) => (
                <Menu.Item key={children.key}>{children.title}</Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={menu.key} icon={menu.icon}>
              {menu.title}
            </Menu.Item>
          )
        })}
      </Menu>
    </>
  )
}
