import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { SiderSwitchIcon } from './icon/Icon'
import { LayoutSider } from './layout/Sider'
import { LayoutHeader } from './layout/Header'
import { Dashboard } from './dashboard/Dashboard'
import Supplier from './supplier/Supplier'
import SupplierDetail from './supplier/SupplierDetail'
import Customer from './customer/Customer'
import CustomerDetail from './customer/CustomerDetail'
import Employee from './employee/Employee'
import EmployeeDetail from './employee/EmployeeDetail'

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
              {/* Basic */}
              {/* Supplier */}
              <Route
                exact
                path='/Basic/Supplier/Add'
                render={(props) => <SupplierDetail {...props} createFlag={true} />}
              />
              <Route
                exact
                path='/Basic/Supplier/:vendorId'
                render={(props) => <SupplierDetail {...props} createFlag={false} />}
              />
              <Route exact path='/Basic/Supplier' component={Supplier} />
              {/* Customer */}
              <Route
                exact
                path='/Basic/Customer/Add'
                render={(props) => <CustomerDetail {...props} createFlag={true} />}
              />
              <Route
                exact
                path='/Basic/Customer/:customerId'
                render={(props) => <CustomerDetail {...props} createFlag={false} />}
              />
              <Route exact path='/Basic/Customer' component={Customer} />
              {/* Employee */}
              <Route
                exact
                path='/Basic/Employee/Add'
                render={(props) => <EmployeeDetail {...props} createFlag={true} />}
              />
              <Route
                exact
                path='/Basic/Employee/:employeeId'
                render={(props) => <EmployeeDetail {...props} createFlag={false} />}
              />
              <Route exact path='/Basic/Employee' component={Employee} />
              <Route path='/' component={Dashboard} />
            </Switch>
          </Layout.Content>
          <Layout.Footer className='layout-footer'>2021 &copy; Copyright</Layout.Footer>
        </Layout>
      </Layout>
    )
  }
}
