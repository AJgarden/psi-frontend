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
      formStatus: JSON.parse(JSON.stringify(formRules)),
      canSubmit: false
    }
    if (!props.createFlag) {
      this.getEmployeeData()
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
    } else if (!this.props.createFlag && prevProps.employeeId !== this.props.employeeId) {
      this.setState(
        {
          loading: true,
          formData: { ...initData },
          formStatus: JSON.parse(JSON.stringify(formRules)),
          canSubmit: false
        },
        () => this.getEmployeeData()
      )
    }
  }

  getEmployeeData = () => {
    this.employeeAPI
      .getEmployeeData(this.props.employeeId)
      .then((response) => {
        if (response.code === 0) {
          this.setState(
            {
              loading: false,
              formData: {
                ...response.data,
                birthday: moment(response.data.birthday, 'YYYY-MM-DD').valueOf(),
                takeOfficeDay: moment(response.data.takeOfficeDay, 'YYYY-MM-DD').valueOf()
              }
            },
            () => this.checkCanSubmit()
          )
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
      this.employeeAPI
        .addEmployeeData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              this.history.push('/Basic/Employee')
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
      this.employeeAPI
        .updateEmployeeData(this.props.employeeId, {
          ...this.state.formData,
          birthday: moment(this.state.formData.birthday).format('YYYY-MM-DD'),
          takeOfficeDay: moment(this.state.formData.takeOfficeDay).format('YYYY-MM-DD')
        })
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              this.history.push('/Basic/Employee')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getEmployeeData()
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
            <Link to='/Basic/Employee'>員工</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '新增員工' : '修改員工資料'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting}>
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
                  message='員工編號為必填,長度需在10字內'
                  error={this.getFormErrorStatus('employeeId')}
                />
              </Col>
              <Col {...colSetting}>
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
                  message='身分證號為必填,長度需在10字內'
                  error={this.getFormErrorStatus('identityCardNumber')}
                />
              </Col>
              <Col {...colSetting}>
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
                  message='姓名為必填,長度需在30字內'
                  error={this.getFormErrorStatus('name')}
                />
              </Col>
              <Col {...colSetting}>
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
              <Col {...colSetting}>
                <FormItem
                  required={false}
                  title='手機號碼'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.cellphone}
                      id='cellphone'
                    />
                  }
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('cellphone')}
                />
              </Col>
              <Col {...colSetting}>
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
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('phone')}
                />
              </Col>
              <Col {...colSetting}>
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
              <Col {...colSetting}>
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
                  message='長度需在10字內'
                  error={this.getFormErrorStatus('education')}
                />
              </Col>
              <Col {...colSetting}>
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
              <Col {...colSetting}>
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
              <Col {...colSetting}>
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
                  title='經歷'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.experience}
                      id='experience'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                  message='長度需在255字內'
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
                  message='長度需在255字內'
                  error={this.getFormErrorStatus('note')}
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
                    // disabled={!this.state.canSubmit}
                    onClick={this.handleCreate.bind(this, true)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    // disabled={!this.state.canSubmit}
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
                    // disabled={!this.state.canSubmit}
                    onClick={this.handleSubmit.bind(this, false)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    // disabled={!this.state.canSubmit}
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
