import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, Row, Input, Button, Space, Modal, Spin, message } from 'antd'
import { FormItem } from '../../component/FormItem'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { createHashHistory } from 'history'
import { initData, formRules } from './customerType'
// import addressDistrict from '../../model/resource/addressDistrict.json'
import CustomerAPI from '../../model/api/customer'

export default class CustomerForm extends React.Component {
  history = createHashHistory()
  customerAPI = new CustomerAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: { ...initData },
      formStatus: JSON.parse(JSON.stringify(formRules)),
      canSubmit: false
    }
    if (!props.createFlag) {
      this.getCustomerData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({
        loading: false,
        formData: { ...initData },
        formStatus: JSON.parse(JSON.stringify(formRules)),
        canSubmit: false
      })
    } else if (!this.props.createFlag && prevProps.customerId !== this.props.customerId) {
      this.setState(
        {
          loading: true,
          formData: { ...initData },
          formStatus: JSON.parse(JSON.stringify(formRules)),
          canSubmit: false
        },
        () => this.getCustomerData()
      )
    }
  }

  getCustomerData = () => {
    this.customerAPI
      .getCustomerData(this.props.customerId)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loading: false, formData: response.data }, () => this.checkCanSubmit())
        } else {
          message.error(response.message)
          this.history.push('/Basic/Customer')
        }
      })
      .catch(() => {
        message.error('Error!')
        this.history.push('/Basic/Customer')
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
    this.setState({ canSubmit: !this.state.formStatus.some((field) => field.error) })
  }

  // 新增
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      this.customerAPI
        .addCustomerData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              this.history.push('/Basic/Customer')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.setState({
                loading: false,
                formData: { ...initData },
                formStatus: JSON.parse(JSON.stringify(formRules)),
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
      this.customerAPI
        .updateCustomerData(this.props.customerId, this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              this.history.push('/Basic/Customer')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getCustomerData()
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

  handleCancel = () => {
    Modal.confirm({
      title: '變更尚未儲存，確定要離開嗎',
      icon: <ExclamationCircleOutlined />,
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        this.history.push('/Basic/Customer')
      }
    })
  }

  render() {
    const rowSetting = {
      gutter: [24, 24],
      type: 'flex',
      align: 'middle',
      style: { marginBottom: 24, marginTop: 24 }
    }
    const colSetting = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 8
    }
    return (
      <>
        <Breadcrumb style={{ marginBottom: 10 }}>
          <Breadcrumb.Item>
            <Link to='/Basic/Customer'>客戶</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '新增客戶' : '修改客戶資料'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting}>
                <FormItem
                  required={true}
                  title='客戶代號'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.customerId}
                      id='customerId'
                      disabled={!this.props.createFlag}
                    />
                  }
                  message='客戶代號為必填,長度需在10字內'
                  error={this.getFormErrorStatus('customerId')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={true}
                  title='客戶名稱'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.name}
                      id='name'
                    />
                  }
                  message='客戶名稱為必填,長度需在30字內'
                  error={this.getFormErrorStatus('name')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={true}
                  title='客戶簡稱'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.shortName}
                      id='shortName'
                    />
                  }
                  message='客戶簡稱為必填,長度需在10字內'
                  error={this.getFormErrorStatus('shortName')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='負責人'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.principal}
                      id='principal'
                    />
                  }
                  message='長度需在2~10字'
                  error={this.getFormErrorStatus('principal')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='聯絡人'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.contactPerson}
                      id='contactPerson'
                    />
                  }
                  message='長度需在2~10字'
                  error={this.getFormErrorStatus('contactPerson')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='傳真號碼'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.faxNumber}
                      id='faxNumber'
                    />
                  }
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('faxNumber')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='電話1'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.phone1}
                      id='phone1'
                    />
                  }
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('phone1')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='電話2'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.phone2}
                      id='phone2'
                    />
                  }
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('phone2')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='行動電話'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.cellPhone}
                      id='cellPhone'
                    />
                  }
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('cellPhone')}
                />
              </Col>
            </Row>
          </Card>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col span={24}>
                <FormItem
                  required={false}
                  title='地址'
                  content={
                    <>
                      <Row type='flex' gutter={[10]}>
                        <Col style={{ width: 120 }}>
                          <Input
                            onChange={this.onInputChange}
                            value={this.state.formData.postCode}
                            id='postCode'
                            placeholder='郵遞區號'
                          />
                        </Col>
                        <Col style={{ width: 'calc(100% - 120px)' }}>
                          <Input
                            onChange={this.onInputChange}
                            value={this.state.formData.address}
                            id='address'
                            placeholder='地址'
                          />
                        </Col>
                      </Row>
                    </>
                  }
                  message='長度需在100字內'
                  error={this.getFormErrorStatus('address')}
                />
              </Col>
            </Row>
          </Card>
          <Card className='form-detail-card'>
            <Row {...rowSetting} align='top'>
              <Col span={24}>
                <FormItem
                  required={false}
                  align='flex-start'
                  title='備註1'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note1}
                      id='note1'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                  message='長度需在255字內'
                  error={this.getFormErrorStatus('note1')}
                />
              </Col>
            </Row>
            <Row {...rowSetting}>
              <Col span={24}>
                <FormItem
                  required={false}
                  align='flex-start'
                  title='備註2'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note2}
                      id='note2'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                  message='長度需在255字內'
                  error={this.getFormErrorStatus('note2')}
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
