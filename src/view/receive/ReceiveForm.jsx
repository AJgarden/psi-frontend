import React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  Spin,
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Input,
  InputNumber,
  Space,
  Button,
  message,
  Modal
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { createHashHistory } from 'history'
import moment from 'moment'
import { FormItem } from '../../component/FormItem'
import { initData } from './receiveType'
import ReceiveAPI from '../../model/api/receive'
import { ListDeleteIcon } from '../icon/Icon'

export default class ReceiveForm extends React.Component {
  history = createHashHistory()
  receiveAPI = new ReceiveAPI()

  constructor(props) {
    super(props)
    const formData = JSON.parse(JSON.stringify(initData))
    formData.paymentReceiveDate = moment().startOf('day').valueOf()
    this.state = {
      inited: false,
      loading: true,
      lastLoading: false,
      thisLoading: false,
      formData,
      search: {
        customerId: ''
      },
      customerList: []
    }
    if (!props.createFlag) {
      this.getInitData(false).then(() =>
        this.getReceiveData().then(() => this.setState({ inited: true, loading: false }))
      )
    } else {
      this.getInitData(true).then(() => this.setState({ inited: true, loading: false }))
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.createFlag && this.props.createFlag) ||
      (!prevProps.drawModeVisible && this.props.drawModeVisible) ||
      (!this.props.createFlag && prevProps.paymentReceiveId !== this.props.paymentReceiveId)
    ) {
      const formData = JSON.parse(JSON.stringify(initData))
      formData.paymentReceiveDate = moment().startOf('day').valueOf()
      this.setState(
        {
          inited: false,
          loading: true,
          lastLoading: false,
          thisLoading: false,
          formData,
          search: {
            customerId: ''
          }
        },
        () => {
          if (!this.props.createFlag) {
            this.getInitData(false).then(() =>
              this.getReceiveData().then(() => this.setState({ inited: true, loading: false }))
            )
          } else {
            this.getInitData(true).then(() => this.setState({ inited: true, loading: false }))
          }
        }
      )
    }
  }

  getInitData = async () => {
    await new Promise((resolve) => {
      this.receiveAPI.getCustomerList().then((response) => {
        this.setState({ customerList: response.data.list }, () => resolve(true))
      })
    })
  }

  getReceiveData = async () => {
    await new Promise((resolve, reject) => {
      this.receiveAPI
        .getReceiveData(this.props.paymentReceiveId)
        .then((response) => {
          if (response.code === 0) {
            this.setState({ formData: response.data }, () => resolve(true))
          } else {
            reject(false)
            message.error(response.message)
            if (this.props.isDrawMode) {
              this.props.onClose()
            } else {
              this.history.push('/Receive/List')
            }
          }
        })
        .catch(() => {
          reject(false)
          message.error('Error!')
          if (this.props.isDrawMode) {
            this.props.onClose()
          } else {
            this.history.push('/Receive/List')
          }
        })
    })
  }

  getCustomerInfo = () => {
    const { formData } = this.state
    this.receiveAPI
      .getCustomerInfo(formData.customerId)
      .then((response) => {
        if (response.code === 0) {
          formData.lastSalesAccountingDate = moment(
            response.data.lastSalesAccountingDate,
            'YYYY-MM-DD'
          )
            .startOf('day')
            .valueOf()
          formData.outstandingPayment = response.data.outstandingPayment
          if (
            moment(formData.lastSalesAccountingDate).date() ===
            moment(formData.lastSalesAccountingDate).endOf('month').date()
          ) {
            formData.salesAccountingDate = moment(formData.lastSalesAccountingDate)
              .add(7, 'days')
              .endOf('month')
              .startOf('day')
              .valueOf()
          } else {
            formData.salesAccountingDate = moment(formData.lastSalesAccountingDate)
              .add(1, 'month')
              .startOf('day')
              .valueOf()
          }
          this.setState({ formData, lastLoading: false }, () => this.getCustomerAccount())
        } else {
          message.error(response.message)
          this.setState({ lastLoading: false })
        }
      })
      .catch((error) => {
        message.error(error.data.message)
        this.setState({ lastLoading: false })
      })
  }

  getCustomerAccount = () => {
    const { formData } = this.state
    this.receiveAPI
      .getCustomerAccount(
        formData.customerId,
        moment(formData.salesAccountingDate).format('YYYY-MM-DD')
      )
      .then((response) => {
        if (response.code === 0) {
          formData.accountsReceivable = response.data.accountsReceivable
          this.setState({ thisLoading: false, formData })
        } else {
          message.error(response.message)
          this.setState({ thisLoading: false })
        }
      })
      .catch((error) => {
        message.error(error.data.message)
        this.setState({ thisLoading: false })
      })
  }

  onDateChange = (type, date) => {
    const { formData } = this.state
    formData[type] = moment(date).valueOf()
    this.setState({ formData }, () => {
      if (type === 'salesAccountingDate') {
        this.setState({ thisLoading: true }, () => this.getCustomerAccount())
      }
    })
  }
  onSelectChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.setState({ formData })
  }
  onInputChange = (type, event) => {
    const { formData } = this.state
    formData[type] = event.target.value
    this.setState({ formData })
  }
  onNumberChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.setState({ formData })
  }

  // code select
  onCodeSearch = (value) => {
    if (!value.includes(' ')) {
      const { search } = this.state
      search.customerId = value.toUpperCase()
      this.setState({ search })
    }
  }
  onCodeSelect = (value) => {
    const { formData, search, customerList } = this.state
    search.customerId = ''
    if (value !== formData.customerId) {
      formData.customerId = value
      formData.salesAccountingDate = null
      formData.accountsReceivable = 0
      const customer = customerList.find(
        (customer) => customer.customerId.toLowerCase() === value.toLowerCase()
      )
      if (customer) formData.customerName = customer.name
      this.setState({ lastLoading: true, thisLoading: true, search, formData }, () => this.getCustomerInfo())
    }
  }
  // get code options
  getCustomerOptions = () => {
    const { formData, search, customerList } = this.state
    return customerList
      .filter(
        (customer) =>
          formData.customerId === customer.customerId ||
          (search.customerId &&
            customer.customerId.toLowerCase().match(`^${search.customerId.toLowerCase()}`, 'i'))
      )
      .map((customer) => {
        return {
          label: `${customer.customerId} - ${customer.name}`,
          value: customer.customerId
        }
      })
  }

  // displayDollar = (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // getAccountTotal = () => {
  //   const { formData } = this.state
  //   return `$ ${formData.lastOutstandingPayment + formData.accountsReceivable}`.replace(
  //     /\B(?=(\d{3})+(?!\d))/g,
  //     ','
  //   )
  // }
  getTotalAmount = () => {
    const { formData } = this.state
    const total =
      formData.check +
      formData.cash +
      formData.discount +
      formData.others +
      formData.adjustment +
      formData.payable
    return `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  handleSave = (back) => {
    this.setState({ loading: true }, () => {
      const { formData } = this.state
      formData.paymentReceiveDate = moment(formData.paymentReceiveDate).format('YYYY-MM-DD')
      formData.lastSalesAccountingDate = moment(formData.lastSalesAccountingDate).format(
        'YYYY-MM-DD'
      )
      formData.salesAccountingDate = moment(formData.salesAccountingDate).format('YYYY-MM-DD')
      formData.checkPostDated = moment(formData.checkPostDated).format('YYYY-MM-DD')
      this.receiveAPI
        .saveReceive(formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Receive/List')
              }
            } else {
              const drawerContent = document.querySelector('.ant-drawer-body')
              const layoutContent = document.getElementById('layout-content-wrapper')
              if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' })
              if (layoutContent) layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              const formData = JSON.parse(JSON.stringify(initData))
              formData.paymentReceiveDate = moment().startOf('day')
              this.setState({
                loading: false,
                formData,
                search: {
                  customerId: ''
                }
              })
            }
          } else {
            Modal.error({
              title: response.message,
              icon: <ExclamationCircleOutlined />,
              content: response.data.map((tip, index) => (
                <>
                  {index > 0 && <br />}
                  {tip.split(': ')[1]}
                </>
              )),
              okText: '確認',
              cancelText: null,
              onOk: () => {
                this.setState({ loading: false })
              }
            })
          }
        })
        .catch((error) => {
          message.error(error.data.message)
          this.setState({ loading: false })
        })
    })
  }

  handleAbort = () => {
    Modal.confirm({
      title: '確認註銷收款單',
      content: (
        <>
          請確認是否要註銷收款單號{' '}
          <span style={{ color: 'red' }}>{this.state.formData.paymentReceiveId}</span> ?
        </>
      ),
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        this.setState({ loading: true }, () => {
          this.receiveAPI
            .abortReceive(this.state.formData.paymentReceiveId)
            .then((response) => {
              if (response.code === 0) {
                message.success('成功註銷收款單')
                if (this.props.isDrawMode) {
                  this.props.onClose(true)
                } else {
                  this.history.push('/Receive/List')
                }
              } else {
                message.error(response.message)
              }
            })
            .catch((error) => {
              message.error(error.data.message)
              this.setState({ loading: false })
            })
        })
      }
    })
  }

  handleCancel = () => {
    if (this.props.isDrawMode) {
      this.props.onClose()
    } else {
      this.history.push('/Receive/List')
    }
  }

  render() {
    const rowSetting = this.props.isDrawMode
      ? {
          gutter: [12, 12],
          type: 'flex',
          align: 'middle',
          style: { marginBottom: 12, marginTop: 12 }
        }
      : {
          gutter: [24, 24],
          type: 'flex',
          align: 'middle',
          style: { marginBottom: 24, marginTop: 24 }
        }
    const colSetting1 = this.props.isDrawMode
      ? {
          span: 12
        }
      : {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 12
        }
    const colSetting2 = this.props.isDrawMode
      ? {
          span: 8
        }
      : {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 8
        }
    return (
      <>
        {!this.props.isDrawMode && (
          <Breadcrumb style={{ marginBottom: 10 }}>
            <Breadcrumb.Item>
              <Link to='/Receive/List'>收款單</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.createFlag ? '新增收款單' : '查看收款單'}</Breadcrumb.Item>
          </Breadcrumb>
        )}
        <Spin spinning={this.state.loading} className='product-spinning'>
          {this.state.inited && (
            <>
              <Card className='form-detail-card'>
                <Row {...rowSetting}>
                  {!this.props.createFlag && (
                    <Col span={24}>
                      <FormItem
                        title='收款單號'
                        content={
                          <span style={{ color: '#2a9d8f' }}>{this.props.paymentReceiveId}</span>
                        }
                      />
                    </Col>
                  )}
                  <Col {...colSetting1}>
                    <FormItem
                      title='收款日期'
                      content={
                        <DatePicker
                          value={moment(this.state.formData.paymentReceiveDate)}
                          allowClear={false}
                          disabled={!this.props.createFlag}
                          onChange={this.onDateChange.bind(this, 'paymentReceiveDate')}
                          style={{ width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='客戶代號'
                      content={
                        <Select
                          placeholder='搜尋客戶代號'
                          autoFocus={true}
                          value={this.state.formData.customerId}
                          searchValue={this.state.search.customerId}
                          showSearch={true}
                          showArrow={false}
                          options={this.getCustomerOptions()}
                          onSearch={this.onCodeSearch}
                          onSelect={this.onCodeSelect}
                          style={{ width: '100%' }}
                          notFoundContent={null}
                          disabled={!this.props.createFlag}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='上次收款之銷貨截止日'
                      content={
                        <Spin spinning={this.state.lastLoading}>
                          <DatePicker
                            placeholder='請選擇客戶'
                            value={
                              this.state.formData.lastSalesAccountingDate === null
                                ? undefined
                                : moment(this.state.formData.lastSalesAccountingDate)
                            }
                            disabled={true}
                            style={{ width: '100%' }}
                          />
                        </Spin>
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='本次收款之銷貨截止日'
                      content={
                        <DatePicker
                          placeholder='請選擇日期'
                          value={
                            this.state.formData.salesAccountingDate === null
                              ? undefined
                              : moment(this.state.formData.salesAccountingDate)
                          }
                          allowClear={false}
                          disabled={!this.props.createFlag || this.state.formData.customerId === ''}
                          onChange={this.onDateChange.bind(this, 'salesAccountingDate')}
                          style={{ width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting2}>
                    <FormItem
                      title='上期未收'
                      content={
                        <Input
                          value={this.state.formData.outstandingPayment}
                          disabled={true}
                          style={{ width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting2}>
                    <Spin spinning={this.state.thisLoading}>
                      <FormItem
                        title='本期金額'
                        content={
                          <Input
                            value={this.state.formData.accountsReceivable}
                            disabled={true}
                            style={{ width: '100%' }}
                          />
                        }
                      />
                    </Spin>
                  </Col>
                  <Col {...colSetting2}>
                    <Spin spinning={this.state.lastLoading || this.state.thisLoading}>
                      <FormItem
                        title='總計金額'
                        content={
                          <Input
                            value={
                              this.state.formData.outstandingPayment +
                              this.state.formData.accountsReceivable
                            }
                            disabled={true}
                            style={{ width: '100%' }}
                          />
                        }
                      />
                    </Spin>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      title='備註'
                      align='flex-start'
                      content={
                        <Input.TextArea
                          onChange={this.onInputChange.bind(this, 'remark')}
                          value={this.state.formData.remark}
                          id='note'
                          autoSize={{ minRows: 1, maxRows: 4 }}
                          disabled={!this.props.createFlag}
                        />
                      }
                    />
                  </Col>
                </Row>
              </Card>
              <Card className='form-detail-card'>
                <Row {...rowSetting}>
                  <Col span={24}>
                    <p className='product-real-pictitle'>收款明細</p>
                  </Col>
                </Row>
                <Row {...rowSetting}>
                  <Col {...colSetting1}>
                    <FormItem
                      title='票據金額'
                      content={
                        <InputNumber
                          onChange={this.onNumberChange.bind(this, 'check')}
                          value={this.state.formData.check}
                          min={0}
                          max={99999999}
                          step={1}
                          disabled={!this.props.createFlag}
                          style={{ display: 'block', width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  {this.state.formData.check > 0 && (
                    <Col span={24} style={{ backgroundColor: '#f7f7f7' }}>
                      <Row {...rowSetting}>
                        <Col {...colSetting1}>
                          <FormItem
                            title='票據號碼'
                            content={
                              <Input
                                onChange={this.onInputChange.bind(this, 'checkNumber')}
                                value={this.state.formData.checkNumber}
                                disabled={!this.props.createFlag}
                                style={{ width: '100%' }}
                              />
                            }
                          />
                        </Col>
                        <Col {...colSetting1}>
                          <FormItem
                            title='票據到期日'
                            content={
                              <DatePicker
                                placeholder='請選擇日期'
                                value={
                                  this.state.formData.checkPostDated === null
                                    ? undefined
                                    : moment(this.state.formData.checkPostDated)
                                }
                                allowClear={false}
                                disabled={!this.props.createFlag}
                                onChange={this.onDateChange.bind(this, 'checkPostDated')}
                                style={{ width: '100%' }}
                              />
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  )}
                </Row>
                <Row {...rowSetting}>
                  <Col {...colSetting1}>
                    <FormItem
                      title='現金金額'
                      content={
                        <InputNumber
                          onChange={this.onNumberChange.bind(this, 'cash')}
                          value={this.state.formData.cash}
                          min={-99999999}
                          max={99999999}
                          step={1}
                          disabled={!this.props.createFlag}
                          style={{ display: 'block', width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='折讓金額'
                      content={
                        <InputNumber
                          onChange={this.onNumberChange.bind(this, 'discount')}
                          value={this.state.formData.discount}
                          min={-99999999}
                          max={99999999}
                          step={1}
                          disabled={!this.props.createFlag}
                          style={{ display: 'block', width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='其他金額'
                      content={
                        <InputNumber
                          onChange={this.onNumberChange.bind(this, 'others')}
                          value={this.state.formData.others}
                          min={-99999999}
                          max={99999999}
                          step={1}
                          disabled={!this.props.createFlag}
                          style={{ display: 'block', width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='帳款調整'
                      content={
                        <InputNumber
                          onChange={this.onNumberChange.bind(this, 'adjustment')}
                          value={this.state.formData.adjustment}
                          min={-99999999}
                          max={99999999}
                          step={1}
                          disabled={!this.props.createFlag}
                          style={{ display: 'block', width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title='對扣帳'
                      content={
                        <InputNumber
                          onChange={this.onNumberChange.bind(this, 'payable')}
                          value={this.state.formData.payable}
                          min={-99999999}
                          max={99999999}
                          step={1}
                          disabled={!this.props.createFlag}
                          style={{ display: 'block', width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting1}>
                    <FormItem
                      title=''
                      content={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            textAlign: 'right'
                          }}
                        >
                          <div>總收款金額:</div>
                          <div style={{ width: 140, color: 'red', marginLeft: 10 }}>
                            {this.getTotalAmount()}
                          </div>
                        </div>
                      }
                    />
                  </Col>
                </Row>
              </Card>
              <div style={{ margin: '20px', textAlign: 'center' }}>
                <Space>
                  {this.props.createFlag ? (
                    <>
                      <Button
                        type='primary'
                        icon={<CheckOutlined />}
                        disabled={this.state.formData.customerId === ''}
                        onClick={this.handleSave.bind(this, true)}
                      >
                        儲存
                      </Button>
                      <Button
                        type='primary'
                        icon={<CheckOutlined />}
                        disabled={this.state.formData.customerId === ''}
                        onClick={this.handleSave.bind(this, false)}
                      >
                        儲存並繼續新增
                      </Button>
                      <Button danger icon={<CloseOutlined />} onClick={this.handleCancel}>
                        取消
                      </Button>
                    </>
                  ) : this.state.formData.activeFlag !== 'N' ? (
                    <Button
                      className='form-option-print'
                      icon={<ListDeleteIcon />}
                      onClick={this.handleAbort}
                    >
                      註銷
                    </Button>
                  ) : null}
                </Space>
              </div>
            </>
          )}
        </Spin>
      </>
    )
  }
}
