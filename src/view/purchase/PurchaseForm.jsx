import React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  Spin,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Space,
  Button,
  Modal,
  message
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import { initData, formRules } from './purchaseType'
import PurchaseAPI from '../../model/api/purchase'

export default class PurchaseForm extends React.Component {
  history = createHashHistory()
  purchaseAPI = new PurchaseAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      formData: { ...initData },
      formStatus: JSON.parse(JSON.stringify(formRules)),
      search: {
        vendorId: ''
      },
      vendorList: [],
      canSubmit: false
    }
    this.getInitData().then(() => {
      if (!props.createFlag) {
        this.getPurchaseData().then(() => this.setState({ loading: false }))
      } else {
        this.setState({ loading: false })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.createFlag && this.props.createFlag) ||
      (!prevProps.drawModeVisible && this.props.drawModeVisible) ||
      (!this.props.createFlag && prevProps.purchaseId !== this.props.purchaseId)
    ) {
      this.setState(
        {
          loading: true,
          formData: { ...initData },
          formStatus: JSON.parse(JSON.stringify(formRules)),
          search: {
            vendorId: ''
          },
          canSubmit: false
        },
        () =>
          this.getInitData().then(() => {
            if (!this.props.createFlag) {
              this.getPurchaseData().then(() => this.setState({ loading: false }))
            } else {
              this.setState({ loading: false })
            }
          })
      )
    }
  }

  getInitData = async () => {
    await new Promise((resolve) => {
      this.purchaseAPI.getVendorsList().then((response) => {
        this.setState({ vendorList: response.data.list }, () => resolve(true))
      })
    })
  }

  getProductData = () => {
    return new Promise((resolve, reject) => {
      this.purchaseAPI
        .getPurchaseData(this.props.purchaseId)
        .then((response) => {
          if (response.code === 0) {
            this.setState({ formData: response.data }, () =>
              this.checkCanSubmit().then(() => resolve(true))
            )
          } else {
            reject(false)
            message.error(response.message)
            if (this.props.isDrawMode) {
              this.props.onClose()
            } else {
              this.history.push('/Purchase/List')
            }
          }
        })
        .catch(() => {
          reject(false)
          message.error('Error!')
          if (this.props.isDrawMode) {
            this.props.onClose()
          } else {
            this.history.push('/Purchase/List')
          }
        })
    })
  }

  getFormErrorStatus = (key) => {
    const { formStatus } = this.state
    const field = formStatus.find((field) => field.key === key)
    return field ? field.error : false
  }

  onInputChange = (event) => {
    const type = event.target.getAttribute('id')
    const text = event.target.value
    const { formData } = this.state
    formData[type] = text
    this.checkData(formData, type)
  }
  onSelectChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.checkData(formData, type)
  }
  onNumberChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.checkData(formData, type)
  }
  onDateChange = (type, date) => {
    const { formData } = this.state
    formData[type] = date
    this.checkData(formData, type)
  }

  // code select
  onCodeSearch = (key, value) => {
    if (!value.includes(' ')) {
      const { search } = this.state
      search[key] = value.toUpperCase()
      this.setState({ search })
    }
  }
  onCodeSelect = (key, value) => {
    const { formData, search, vendorList } = this.state
    search[key] = ''
    formData[key] = value
    if (key === 'vendorId') {
      const vendor = vendorList.find(
        (vendor) => vendor.vendorId.toLowerCase() === value.toLowerCase()
      )
      if (vendor) formData.vendorName = vendor.name
    }
    this.setState({ search }, () => this.checkData(formData, key))
  }
  // get code options
  getVendorOptions = () => {
    const { formData, search, vendorList } = this.state
    return vendorList
      .filter(
        (vendor) =>
          formData.vendorId === vendor.vendorId ||
          (search.vendorId && vendor.vendorId.toLowerCase().includes(search.vendorId.toLowerCase()))
      )
      .map((vendor) => {
        return {
          label: `${vendor.vendorId} - ${vendor.name}`,
          value: vendor.vendorId
        }
      })
  }

  // field validator
  checkData = (formData, fieldKey) => {
    const { formStatus } = this.state
    const field = formStatus.find((field) => field.key === fieldKey)
    if (field) {
      const value = formData[fieldKey]
      let error = false
      if (field.required && !value) {
        error = true
      }
      if (field.length && field.length.length > 0 && value) {
        if (field.length.length === 1 && value.length > field.length[0]) {
          error = true
        } else if (
          field.length.length > 1 &&
          (value.length < field.length[0] || value.length > field.length[1])
        ) {
          error = true
        }
      }
      if (field.regExp && !field.regExp.test(value)) {
        error = true
      }
      field.error = error
    }
    this.setState({ formData, formStatus }, () => this.checkCanSubmit())
  }
  checkCanSubmit = () => {
    return new Promise((resolve) => {
      this.setState({ canSubmit: !this.state.formStatus.some((field) => field.error) }, () =>
        resolve(true)
      )
    })
  }

  // 新增
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      this.purchaseAPI
        .addPurchaseData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Purchase/List')
              }
            } else {
              const drawerContent = document.querySelector('.ant-drawer-body')
              const layoutContent = document.getElementById('layout-content-wrapper')
              if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' })
              if (layoutContent) layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.setState({
                loading: false,
                formData: { ...initData },
                formStatus: JSON.parse(JSON.stringify(formRules)),
                search: {
                  vendorId: ''
                },
                canSubmit: false
              })
            }
          } else {
            Modal.error({
              title: response.message,
              icon: <ExclamationCircleOutlined />,
              okText: '確認',
              cancelText: null,
              onOk: () => {
                this.setState({ loading: false })
              }
            })
          }
        })
        .catch((error) => {
          message.error(error.response.data.message)
          this.setState({ loading: false })
        })
    })
  }
  // 修改
  handleSubmit = (back) => {
    this.setState({ loading: true }, () => {
      this.purchaseAPI
        .updatePurchaseData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Purchase/List')
              }
            } else {
              const drawerContent = document.querySelector('.ant-drawer-body')
              const layoutContent = document.getElementById('layout-content-wrapper')
              if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' })
              if (layoutContent) layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getProductData()
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
        .catch(() => {
          message.error('資料更新失敗')
          this.setState({ loading: false })
        })
    })
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
          span: 24
        }
      : {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 8
        }
    const colSetting2 = this.props.isDrawMode
      ? {
          span: 24
        }
      : {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 16
        }
    return (
      <>
        {!this.props.isDrawMode && (
          <Breadcrumb style={{ marginBottom: 10 }}>
            <Breadcrumb.Item>
              <Link to='/Purchase/List'>進貨單</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.props.createFlag ? '新增進貨單' : '修改進貨單資料'}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting1}>
                <FormItem
                  required={true}
                  title='進貨日期'
                  content={
                    <DatePicker
                      value={this.state.formData.accountDate}
                      allowClear={false}
                      onChange={this.onDateChange.bind(this, 'accountDate')}
                      style={{ width: '100%' }}
                    />
                  }
                />
              </Col>
              <Col {...colSetting2}>
                <FormItem
                  required={true}
                  title='廠商'
                  content={
                    <Select
                      placeholder='搜尋廠商代號'
                      value={this.state.formData.vendorId}
                      searchValue={this.state.search.vendorId}
                      showSearch={true}
                      showArrow={false}
                      options={this.getVendorOptions()}
                      onSearch={this.onCodeSearch.bind(this, 'vendorId')}
                      onSelect={this.onCodeSelect.bind(this, 'vendorId')}
                      style={{ width: '100%' }}
                      notFoundContent={null}
                      disabled={!this.props.createFlag}
                    />
                  }
                />
              </Col>
              <Col span={24}>
                <FormItem
                  required={false}
                  title='備註'
                  align='flex-start'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note}
                      id='note'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                  message='長度需在255字內'
                  error={this.getFormErrorStatus('note')}
                />
              </Col>
            </Row>
          </Card>
          <Card className='form-detail-card'></Card>
          <div style={{ margin: '20px', textAlign: 'center' }}>
            <Space>
              {this.props.createFlag ? (
                <>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!this.state.canSubmit}
                    onClick={this.handleCreate.bind(this, true)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!this.state.canSubmit}
                    onClick={this.handleCreate.bind(this, false)}
                  >
                    儲存並繼續新增
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!this.state.canSubmit}
                    onClick={this.handleSubmit.bind(this, false)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!this.state.canSubmit}
                    onClick={this.handleSubmit.bind(this, true)}
                  >
                    儲存並返回列表
                  </Button>
                </>
              )}
              <Button danger icon={<CloseOutlined />} onClick={this.handleCancel}>
                取消
              </Button>
            </Space>
          </div>
        </Spin>
      </>
    )
  }
}
