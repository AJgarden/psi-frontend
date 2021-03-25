import React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  Card,
  Col,
  Row,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Modal,
  Spin,
  message
} from 'antd'
import { FormItem } from '../../component/FormItem'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { createHashHistory } from 'history'
import { initData, formRules } from './employeeType'
// import addressDistrict from '../../model/resource/addressDistrict.json'
import EmployeeAPI from '../../model/api/employee'

export default class EmployeeForm extends React.Component {
  history = createHashHistory()
  employeeAPI = new EmployeeAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: { ...initData },
      formStatus: formRules,
      canSubmit: false
    }
    if (!props.createFlag) {
      this.getEmployeeData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({ formData: { ...initData } })
    } else if (!this.props.createFlag && prevProps.employeeId !== this.props.employeeId) {
      this.setState({ loading: true, formData: { ...initData } }, () => this.getEmployeeData())
    }
  }

  getEmployeeData = () => {
    this.employeeAPI
      .getEmployeeData(this.props.employeeId)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loading: false, formData: response.data }, () => this.checkCanSubmit())
        } else {
          message.error(response.message)
          this.history.push('/Basic/Employee')
        }
      })
      .catch(() => {
        message.error('Error!')
        this.history.push('/Basic/Employee')
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
  onDateChange = (type, date) => {
    const { formData } = this.state
    formData[type] = moment(date).valueOf()
    this.checkData(formData, type)
  }
  onNumberChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
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
        this.history.push('/Basic/Employee')
      }, 1000)
    })
  }
  handleSubmit = () => {
    this.setState({ loading: true }, () => {
      setTimeout(() => {
        message.success('成功更新資料')
        this.history.push('/Basic/Employee')
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
        this.history.push('/Basic/Employee')
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
            <Link to='/Basic/Employee'>員工</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '新增員工' : '修改員工資料'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...cloSetting}>
                <FormItem
                  required={true}
                  title='員工編號'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.employeeId}
                      id='employeeId'
                      disabled={!this.props.createFlag}
                    />
                  }
                  message='請輸入員工編號'
                  error={this.getFormErrorStatus('employeeId')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={true}
                  title='身分證號'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.identityCardNumber}
                      id='identityCardNumber'
                    />
                  }
                  message='請輸入身分證字號'
                  error={this.getFormErrorStatus('identityCardNumber')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={true}
                  title='姓名'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.name}
                      id='name'
                    />
                  }
                  message='請輸入姓名'
                  error={this.getFormErrorStatus('name')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='出生年月日'
                  content={
                    <DatePicker
                      onChange={this.onDateChange.bind(this, 'birthday')}
                      value={
                        !this.state.formData.birthday
                          ? undefined
                          : moment(this.state.formData.birthday)
                      }
                      format='YYYY-MM-DD'
                      placeholder=''
                      style={{ display: 'block' }}
                    />
                  }
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='手機號碼'
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
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='市內電話'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.phone}
                      id='phone'
                    />
                  }
                  message='長度需在10字以內'
                  error={this.getFormErrorStatus('phone')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='就職日期'
                  content={
                    <DatePicker
                      onChange={this.onDateChange.bind(this, 'takeOfficeDay')}
                      value={
                        !this.state.formData.takeOfficeDay
                          ? undefined
                          : moment(this.state.formData.takeOfficeDay)
                      }
                      format='YYYY-MM-DD'
                      placeholder=''
                      style={{ display: 'block' }}
                    />
                  }
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='學歷'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.education}
                      id='education'
                    />
                  }
                  message='長度需在10字以內'
                  error={this.getFormErrorStatus('education')}
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='薪資'
                  content={
                    <InputNumber
                      onChange={this.onNumberChange.bind(this, 'salary')}
                      value={this.state.formData.salary}
                      min={0}
                      max={999999}
                      step={1}
                      style={{ display: 'block', width: '100%' }}
                    />
                  }
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='職務津貼'
                  content={
                    <InputNumber
                      onChange={this.onNumberChange.bind(this, 'extraBonus')}
                      value={this.state.formData.extraBonus}
                      min={0}
                      max={999999}
                      step={1}
                      style={{ display: 'block', width: '100%' }}
                    />
                  }
                />
              </Col>
              <Col {...cloSetting}>
                <FormItem
                  required={false}
                  title='全勤津貼'
                  content={
                    <InputNumber
                      onChange={this.onNumberChange.bind(this, 'fullAttendanceBonus')}
                      value={this.state.formData.fullAttendanceBonus}
                      min={0}
                      max={999999}
                      step={1}
                      style={{ display: 'block', width: '100%' }}
                    />
                  }
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
                  title='經歷'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.experience}
                      id='experience'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                  message='長度需在255字以內'
                  error={this.getFormErrorStatus('experience')}
                />
              </Col>
            </Row>
            <Row {...rowSetting}>
              <Col span={24}>
                <FormItem
                  required={false}
                  align='flex-start'
                  title='備註'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note}
                      id='note'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                  message='長度需在255字以內'
                  error={this.getFormErrorStatus('note')}
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
