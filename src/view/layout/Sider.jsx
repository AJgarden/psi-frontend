import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createHashHistory } from 'history'
import { Menu } from 'antd'
import { routes, menuType } from './menuType'

export const LayoutSider = (props) => {
  const [selectedKeys, setSelectedKeys] = useState([])
  useEffect(() => {
    const unlisten = props.history.listen((location, action) => {
      const route = routes.find((route) => route.path === location.pathname)
      document.title = `${route.title} - MOTOBUY PSI`
    })
    return () => {
      unlisten()
    }
  }, [])
  useEffect(() => {
    if (props.match.params.page !== undefined) {
      setSelectedKeys([props.match.params.page])
    } else if (props.match.params.type !== undefined) {
      setSelectedKeys([props.match.params.type])
    } else {
      setSelectedKeys(['Home'])
    }
  }, [props.match.params.type, props.match.params.page])

  const onMenuClick = ({ item }) => {
    const history = createHashHistory()
    const path = item.props.data.routes.map((route) => `/${route}`).join('')
    history.push(path)
    setSelectedKeys(item.props.data.routes[0] === '' ? ['Home'] : item.props.data.routes)
  }

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
      <Menu className='layout-sider-menu' selectedKeys={selectedKeys} onClick={onMenuClick}>
        {menuType.map((menu) => {
          const roles = JSON.parse(localStorage.getItem('MOTOBUY_ROLES'))
          if (
            menu.accessRoles.length < 1 ||
            menu.accessRoles.filter((role) => roles.includes(role)).length > 0
          ) {
            return menu.children && menu.children.length > 0 ? (
              <Menu.SubMenu
                key={menu.key}
                icon={menu.icon}
                title={menu.title}
                popupClassName='layout-sider-popup'
              >
                {menu.children.map((children) => {
                  if (
                    children.accessRoles.length < 1 ||
                    children.accessRoles.filter((role) => roles.includes(role)).length > 0
                  ) {
                    return (
                      <Menu.Item key={children.key} data={children}>
                        {children.title}
                      </Menu.Item>
                    )
                  }
                  return null
                })}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={menu.key} icon={menu.icon} data={menu}>
                {menu.title}
              </Menu.Item>
            )
          }
          return null
        })}
      </Menu>
    </>
  )
}
