import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { SiderSwitchIcon } from './icon/Icon'
import { LayoutSider } from './layout/Sider'
import { LayoutHeader } from './layout/Header'
import { Dashboard } from './dashboard/Dashboard'
import Supplier from './supplier/Supplier'
import AddSupplier from './supplier/AddSupplier'
import EditSupplier from './supplier/EditSupplier'

export default class LayoutPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      siderCollapsed: false
    }
  }

  render() {
    return (
      <Layout className='layout-wrapper'>
        <Layout.Sider
          collapsible
          collapsed={this.state.siderCollapsed}
          onCollapse={(siderCollapsed) => this.setState({ siderCollapsed })}
          trigger={<SiderSwitchIcon />}
          className='layout-sider-wrapper'
        >
          <Route path='/:type?/:page?' component={LayoutSider} />
        </Layout.Sider>
        <Layout className='layout-main'>
          <Layout.Header className='layout-header'>
            <LayoutHeader />
          </Layout.Header>
          <Layout.Content className='layout-content-wrapper'>
            <Switch>
              <Route exact path='/Basic/Supplier/EditSupplier' component={EditSupplier} />
              <Route exact path='/Basic/Supplier/AddSupplier' component={AddSupplier} />
              <Route exact path='/Basic/Supplier' component={Supplier} />
              <Route path='/' component={Dashboard} />
            </Switch>
          </Layout.Content>
          <Layout.Footer className='layout-footer'>
            2021 &copy; Copyright
          </Layout.Footer>
        </Layout>
      </Layout>
    )
  }
}
