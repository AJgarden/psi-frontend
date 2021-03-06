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
import { initData } from './employeeType'
// import addressDistrict from '../../model/resource/addressDistrict.json'
import EmployeeAPI from '../../model/api/employee'

export default class EmployeeForm extends React.Component {
  history = createHashHistory()
  employeeAPI = new EmployeeAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: JSON.parse(JSON.stringify(initData)),
      validId: false
    }
    if (!props.createFlag) {
      this.getEmployeeData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({
        loading: false,
        formData: JSON.parse(JSON.stringify(initData)),
        validId: false
      })
    } else if (!this.props.createFlag && prevProps.employeeId !== this.props.employeeId) {
      this.setState(
        {
          loading: true,
          formData: JSON.parse(JSON.stringify(initData)),
          validId: true
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

  onInputChange = (event) => {
    const type = event.target.getAttribute('id')
    const text = event.target.value
    const { formData } = this.state
    formData[type] = text
    this.setState({ formData })
  }
  onDateChange = (type, date) => {
    const { formData } = this.state
    formData[type] = moment(date).valueOf()
    this.setState({ formData })
  }
  onNumberChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.setState({ formData })
  }

  checkId = () => {
    const { formData } = this.state
    if (formData.employeeId !== '') {
      this.setState({ validId: false }, () => {
        this.employeeAPI.getEmployeeData(formData.employeeId).then((response) => {
          if (response.code === 0) {
            Modal.error({
              title: '????????????????????????????????????',
              icon: <ExclamationCircleOutlined />,
              okText: '??????',
              cancelText: null,
              onOk: () => {
                formData.employeeId = ''
                this.setState({ formData })
              }
            })
          } else {
            this.setState({ validId: true })
          }
        })
      })
    }
  }

  // ??????
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      this.employeeAPI
        .addEmployeeData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('??????????????????')
            if (back) {
              this.history.push('/Basic/Employee')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.setState({
                loading: false,
                formData: JSON.parse(JSON.stringify(initData))
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
              okText: '??????',
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
  // ??????
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
            message.success('??????????????????')
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
              okText: '??????',
              cancelText: null,
              onOk: () => {
                this.setState({ loading: false })
              }
            })
          }
        })
        .catch((error) => {
          message.error('??????????????????')
          this.setState({ loading: false })
        })
    })
  }

  handleCancel = () => {
    Modal.confirm({
      title: '???????????????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      okText: '??????',
      cancelText: '??????',
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
            <Link to='/Basic/Employee'>??????</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '????????????' : '??????????????????'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting}>
                <FormItem
                  title='????????????'
                  content={
                    <Input
                      onBlur={this.checkId}
                      onChange={this.onInputChange}
                      value={this.state.formData.employeeId}
                      id='employeeId'
                      disabled={!this.props.createFlag}
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='????????????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.identityCardNumber}
                      id='identityCardNumber'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='??????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.name}
                      id='name'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='???????????????'
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
                  title='????????????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.cellphone}
                      id='cellphone'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='????????????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.phone}
                      id='phone'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='????????????'
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
                  title='??????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.education}
                      id='education'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='??????'
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
                  title='????????????'
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
                  title='????????????'
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
                  title='??????'
                  content={
                    <>
                      <Row type='flex' gutter={[10]}>
                        <Col style={{ width: 120 }}>
                          <Input
                            onChange={this.onInputChange}
                            value={this.state.formData.postCode}
                            id='postCode'
                            placeholder='????????????'
                          />
                        </Col>
                        <Col style={{ width: 'calc(100% - 120px)' }}>
                          <Input
                            onChange={this.onInputChange}
                            value={this.state.formData.address}
                            id='address'
                            placeholder='??????'
                          />
                        </Col>
                      </Row>
                    </>
                  }
                />
              </Col>
            </Row>
          </Card>
          <Card className='form-detail-card'>
            <Row {...rowSetting} align='top'>
              <Col span={24}>
                <FormItem
                  align='flex-start'
                  title='??????'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.experience}
                      id='experience'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                />
              </Col>
            </Row>
            <Row {...rowSetting}>
              <Col span={24}>
                <FormItem
                  align='flex-start'
                  title='??????'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note}
                      id='note'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
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
                    disabled={!this.state.validId}
                    onClick={this.handleCreate.bind(this, true)}
                  >
                    ??????
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!this.state.validId}
                    onClick={this.handleCreate.bind(this, false)}
                  >
                    ?????????????????????
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={this.handleSubmit.bind(this, false)}
                  >
                    ??????
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={this.handleSubmit.bind(this, true)}
                  >
                    ?????????????????????
                  </Button>
                </>
              )}
              <Button danger icon={<CloseOutlined />} onClick={this.handleCancel}>
                ??????
              </Button>
            </Space>
          </div>
        </Spin>
      </>
    )
  }
}
