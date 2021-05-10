import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ConfigProvider, Layout, message } from 'antd'
import zhTW from 'antd/lib/locale/zh_TW'
import moment from 'moment'
import 'moment/locale/zh-tw'
import { SiderSwitchIcon } from './icon/Icon'
import { Login } from './Login'
import { LayoutSider } from './layout/Sider'
import { LayoutHeader } from './layout/Header'
import Dashboard from './dashboard/Dashboard'
import Supplier from './supplier/Supplier'
import SupplierDetail from './supplier/SupplierDetail'
import Customer from './customer/Customer'
import CustomerDetail from './customer/CustomerDetail'
import Employee from './employee/Employee'
import EmployeeDetail from './employee/EmployeeDetail'
import Vehicle from './vehicle/Vehicle'
import VehicleDetail from './vehicle/VehicleDetail'
import Level from './level/Level'
import LevelDetail from './level/LevelDetail'
import Colour from './colour/Colour'
import ColourDetail from './colour/ColourDetail'
import Component from './component/Component'
import ComponentDetail from './component/ComponentDetail'
import Product from './product/Product'
import ProductQuickEdit from './product/ProductQuickEdit'
import ProductDetail from './product/ProductDetail'
import Purchase from './purchase/Purchase'
import PurchaseDetail from './purchase/PurchaseDetail'
import StaticStorage from '../model/storage/static'
import GlobalAPI from '../model/api/global'
import { testRestInstance } from '../model/runner/rest'

moment.locale('zh-tw')

export default class LayoutPage extends React.Component {
  staticStorage = new StaticStorage()
  globalAPI = new GlobalAPI()

  constructor(props) {
    super(props)
    const cookies = document.cookie.split(';')
    this.state = {
      isLand: !cookies.find((cookie) => cookie.includes('MOTOBUY_AUTH')),
      isAuth: false,
      siderCollapsed: false
    }
    if (cookies.find((cookie) => cookie.includes('MOTOBUY_AUTH'))) {
      testRestInstance('get', '/v1/auth')
        .then((response) => {
          if (response.data.code === 0) {
            this.getGlobalData().then(() => {
              this.setState({ isLand: true, isAuth: true })
            })
          } else {
            this.setState({ isLand: true })
          }
        })
        .catch(() => this.setState({ isLand: true }))
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.clearCookie)
  }
  componentWillUnmount() {
    this.clearCookie()
  }

  getGlobalData = async () => {
    await new Promise((resolve) => {
      this.globalAPI.getUnitList().then((response) => {
        this.staticStorage.setUnitList(response.data)
        resolve(true)
      })
    })
  }

  clearCookie = () => {
    const cookies = document.cookie.split(';')
    if (
      !(
        cookies.find((cookie) => cookie.includes('MOTOBUY_KEEP_LOGIN')) &&
        cookies.find((cookie) => cookie.includes('MOTOBUY_KEEP_LOGIN')).split('=')[1] === 'true'
      )
    ) {
      document.cookie = 'MOTOBUY_AUTH=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }

  onLogin = () => {
    this.getGlobalData().then(() => this.setState({ isAuth: true }))
  }
  onLogout = () => {
    message.success('已成功登出')
    document.cookie = 'MOTOBUY_AUTH=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    this.setState({ isAuth: false })
  }

  render() {
    return this.state.isLand ? (
      this.state.isAuth ? (
        <ConfigProvider locale={zhTW}>
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
                <LayoutHeader onLogout={this.onLogout} />
              </Layout.Header>
              <Layout.Content id='layout-content-wrapper' className='layout-content-wrapper'>
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
                  {/* Vehicle */}
                  <Route
                    exact
                    path='/Parts/Vehicle/Add'
                    render={(props) => <VehicleDetail {...props} createFlag={true} />}
                  />
                  <Route
                    exact
                    path='/Parts/Vehicle/:kindId'
                    render={(props) => <VehicleDetail {...props} createFlag={false} />}
                  />
                  <Route exact path='/Parts/Vehicle' component={Vehicle} />
                  {/* Level */}
                  <Route
                    exact
                    path='/Parts/Level/Add'
                    render={(props) => <LevelDetail {...props} createFlag={true} />}
                  />
                  <Route
                    exact
                    path='/Parts/Level/:gradeId'
                    render={(props) => <LevelDetail {...props} createFlag={false} />}
                  />
                  <Route exact path='/Parts/Level' component={Level} />
                  {/* Colour */}
                  <Route
                    exact
                    path='/Parts/Colour/Add'
                    render={(props) => <ColourDetail {...props} createFlag={true} />}
                  />
                  <Route
                    exact
                    path='/Parts/Colour/:colorId'
                    render={(props) => <ColourDetail {...props} createFlag={false} />}
                  />
                  <Route exact path='/Parts/Colour' component={Colour} />
                  {/* Component */}
                  <Route
                    exact
                    path='/Parts/Component/Add'
                    render={(props) => <ComponentDetail {...props} createFlag={true} />}
                  />
                  <Route
                    exact
                    path='/Parts/Component/:partId'
                    render={(props) => <ComponentDetail {...props} createFlag={false} />}
                  />
                  <Route exact path='/Parts/Component' component={Component} />
                  {/* Product */}
                  <Route
                    exact
                    path='/Products/Add'
                    render={(props) => <ProductDetail {...props} createFlag={true} />}
                  />
                  <Route
                    exact
                    path='/Products/Detail/:seqNo'
                    render={(props) => <ProductDetail {...props} createFlag={false} />}
                  />
                  <Route exact path='/Products/QuickEdit' component={ProductQuickEdit} />
                  <Route exact path='/Products/List' component={Product} />
                  {/* Purchase */}
                  <Route
                    exact
                    path='/Purchase/Add'
                    render={(props) => <PurchaseDetail {...props} createFlag={true} />}
                  />
                  <Route
                    exact
                    path='/Purchase/Detail/:purchaseId'
                    render={(props) => <PurchaseDetail {...props} createFlag={false} />}
                  />
                  <Route exact path='/Purchase/List' component={Purchase} />
                  <Route path='/' component={Dashboard} />
                </Switch>
              </Layout.Content>
              <Layout.Footer className='layout-footer'>2021 &copy; Copyright</Layout.Footer>
            </Layout>
          </Layout>
        </ConfigProvider>
      ) : (
        <ConfigProvider locale={zhTW}>
          <Login onLogin={this.onLogin} />
        </ConfigProvider>
      )
    ) : null
  }
}
