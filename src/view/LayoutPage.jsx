import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ConfigProvider, Layout, message, BackTop } from 'antd'
import zhTW from 'antd/lib/locale/zh_TW'
import moment from 'moment'
import 'moment/locale/zh-tw'
import { SiderSwitchIcon } from './icon/Icon'
import { createHashHistory } from 'history'
import { Login } from './Login'
import { LayoutSider } from './layout/Sider'
import { LayoutHeader } from './layout/Header'
import Dashboard from './dashboard/Dashboard'
import PurchaseReport from './dashboard/PurchaseReport'
import SaleReport from './dashboard/SaleReport'
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
import Sale from './sale/Sale'
import SaleDetail from './sale/SaleDetail'
import SalePrint from './sale/SalePrint'
import Receive from './receive/Receive'
import ReceiveDetail from './receive/ReceiveDetail'
import ProductCode from './qrcode/ProductCode'
import PrintCode from './qrcode/PrintCode'
import StaticStorage from '../model/storage/static'
import GlobalAPI from '../model/api/global'
import { testRestInstance } from '../model/runner/rest'

moment.locale('zh-tw')

export default class LayoutPage extends React.Component {
  staticStorage = new StaticStorage()
  globalAPI = new GlobalAPI()
  history = createHashHistory()

  constructor(props) {
    super(props)
    const cookies = document.cookie.split(';')
    this.state = {
      isLand: !cookies.find((cookie) => cookie.includes('MOTOBUY_AUTH')),
      isAuth: false,
      isPrint: props.location.pathname.includes('Print'),
      siderCollapsed: false
    }
  }

  componentDidMount() {
    window.logout = this.onLogout
    // window.addEventListener('beforeunload', this.clearCookie)
    const cookies = document.cookie.split(';')
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
  // componentWillUnmount() {
  //   this.clearCookie()
  // }

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
  onLogout = (self = false) => {
    if (self) {
      message.success('???????????????')
    } else {
      message.error('?????????????????????????????????')
    }
    document.cookie = 'MOTOBUY_AUTH=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    this.history.replace('/')
    this.setState({ isAuth: false })
  }

  render() {
    return this.state.isLand ? (
      this.state.isAuth ? (
        this.state.isPrint ? (
          <ConfigProvider locale={zhTW}>
            <Layout className='print-wrapper'>
              <Layout.Content>
                <Switch>
                  <Route exact path='/Sale/Print/:salesId' component={SalePrint} />
                  <Route exact path='/QRCode/Print/:size/:productSeqNo' component={PrintCode} />
                </Switch>
              </Layout.Content>
            </Layout>
          </ConfigProvider>
        ) : (
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
                    {/* Report */}
                    <Route exact path='/Report/Purchase' component={PurchaseReport} />
                    <Route exact path='/Report/Sale' component={SaleReport} />
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
                    {/* Sale */}
                    <Route
                      exact
                      path='/Sale/Add'
                      render={(props) => <SaleDetail {...props} createFlag={true} />}
                    />
                    <Route
                      exact
                      path='/Sale/Detail/:salesId'
                      render={(props) => <SaleDetail {...props} createFlag={false} />}
                    />
                    <Route exact path='/Sale/List' component={Sale} />
                    {/* Receive */}
                    <Route
                      exact
                      path='/Receive/Add'
                      render={(props) => <ReceiveDetail {...props} createFlag={true} />}
                    />
                    <Route
                      exact
                      path='/Receive/Detail/:paymentReceiveId'
                      render={(props) => <ReceiveDetail {...props} createFlag={false} />}
                    />
                    <Route exact path='/Receive/List' component={Receive} />
                    <Route exact path='/QRCode' component={ProductCode} />
                    <Route path='/' component={Dashboard} />
                  </Switch>
                  <BackTop target={() => document.getElementById('layout-content-wrapper')} className='layout-content-backtop' />
                </Layout.Content>
                <Layout.Footer className='layout-footer'>2021 &copy; Copyright</Layout.Footer>
              </Layout>
            </Layout>
          </ConfigProvider>
        )
      ) : (
        <ConfigProvider locale={zhTW}>
          <Login onLogin={this.onLogin} />
        </ConfigProvider>
      )
    ) : null
  }
}
