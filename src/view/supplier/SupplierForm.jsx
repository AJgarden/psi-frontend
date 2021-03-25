import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, Row, Input, Button, Space, Modal, Spin, message } from 'antd'
import { FormItem } from '../../component/FormItem'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { createHashHistory } from 'history'
import { initData, formRules } from './supplierType'
// import addressDistrict from '../../model/resource/addressDistrict.json'
import SupplierAPI from '../../model/api/supplier'

export default class SupplierForm extends React.Component {
  history = createHashHistory()
  supplierAPI = new SupplierAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: { ...initData },
      formStatus: formRules,
      canSubmit: false
    }
    if (!props.createFlag) {
      this.getSupplierData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({ formData: { ...initData } })
    } else if (!this.props.createFlag && prevProps.vendorId !== this.props.vendorId) {
      this.setState({ loading: true, formData: { ...initData } }, () => this.getSupplierData())
    }
  }

  getSupplierData = () => {
    this.supplierAPI
      .getSupplierData(this.props.vendorId)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loading: false, formData: response.data }, () => this.checkCanSubmit())
        } else {
          message.error(response.message)
          this.history.push('/Basic/Supplier')
        }
      })
      .catch(() => {
        message.error('Error!')
        this.history.push('/Basic/Supplier')
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
        } else if (value.length < field.length[0] || value.length > field.length[1]) {
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

  handleCreate = () => {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        message.success('成功新增資料')
        this.history.push('/Basic/Supplier')
      }, 1000)
    })
  }
  handleSubmit = () => {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        message.success('成功更新資料')
        this.history.push('/Basic/Supplier')
      }, 1000)
    })
  }

  handleCancel = () => {
    Modal.confirm({
      title: '變更尚未儲存，確定要離開嗎',
      icon: <ExclamationCircleOutlined />,
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        this.history.push('/Basic/Supplier')
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
    const cloSetting = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 8
    }
    return (
      <>
        <Breadcrumb style={{ marginBottom: 10 }}>
          <Breadcrumb.Item>
            <Link to='/Basic/Supplier'>廠商</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '新增廠商' : '修改廠商資料'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...cloSetting}>
                <FormItem
                  required={true}
                  title='廠商代號'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.vendorId}
                      id='vendorId'
                      disabled={!this.props.createFlag}
                    />
                  }
                  message='請輸入廠商代號'
                  error={this.getFormErrorStatus('vendorId')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={true}
                  title='廠商名稱'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.name}
                      id='name'
                    />
                  }
                  message='請輸入廠商名稱'
                  error={this.getFormErrorStatus('name')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='廠商簡稱'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.shortName}
                      id='shortName'
                    />
                  }
                  message='長度需在2~10字'
                  error={this.getFormErrorStatus('shortName')}
                />
              </Col>
              <Col {...cloSetting}>
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
              <Col {...cloSetting}>
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
              <Col {...cloSetting}>
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
                  message='長度需在10字以內'
                  error={this.getFormErrorStatus('faxNumber')}
                />
              </Col>
              <Col {...cloSetting}>
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
                  message='請輸入電話1'
                  error={this.getFormErrorStatus('phone1')}
                />
              </Col>
              <Col {...cloSetting}>
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
                  message='長度需在10字以內'
                  error={this.getFormErrorStatus('phone2')}
                />
              </Col>
              <Col {...cloSetting}>
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
                  message='長度需在10字以內'
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
                  message='長度需在255字以內'
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
                  message='長度需在255字以內'
                  error={this.getFormErrorStatus('note1')}
                />
              </Col>
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
                  message='長度需在255字以內'
                  error={this.getFormErrorStatus('note2')}
                />
              </Col>
            </Row>
          </Card>
          <div style={{ margin: '20px', textAlign: 'center' }}>
            <Space>
              {this.props.createFlag ? (
                <Button type='primary' icon={<CheckOutlined />} onClick={this.handleCreate}>
                  新增
                </Button>
              ) : (
                <Button type='primary' icon={<CheckOutlined />} onClick={this.handleSubmit}>
                  儲存
                </Button>
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