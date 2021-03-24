import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { LayoutSider } from './layout/Sider'
import { Dashboard } from './dashboard/Dashboard'
import Supplier from './supplier/Supplier'

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
          className='layout-sider-wrapper'
        >
          <Route path='/:type?/:page?' component={LayoutSider} />
        </Layout.Sider>
        <Layout>
          <Layout.Header>header</Layout.Header>
          <Layout.Content className='layout-content-wrapper'>
            <Switch>
              <Route exact path='/' component={Dashboard} />
              <Route path='/Basic/Supplier' component={Supplier} />
            </Switch>
          </Layout.Content>
          <Layout.Footer>footer</Layout.Footer>
        </Layout>
      </Layout>
    )
  }
}
