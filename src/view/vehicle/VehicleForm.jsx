import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, Row, Input, Button, Space, Modal, Spin, message } from 'antd'
import { FormItem } from '../../component/FormItem'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { createHashHistory } from 'history'
import { initData } from './vehicleType'
// import addressDistrict from '../../model/resource/addressDistrict.json'
import VehicleAPI from '../../model/api/vehicle'

export default class VehicleForm extends React.Component {
  history = createHashHistory()
  vehicleAPI = new VehicleAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: JSON.parse(JSON.stringify(initData)),
      validId: false
    }
    if (!props.createFlag) {
      this.getVehicleData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({
        loading: false,
        formData: JSON.parse(JSON.stringify(initData)),
        validId: false
      })
    } else if (!this.props.createFlag && prevProps.kindId !== this.props.kindId) {
      this.setState(
        {
          loading: true,
          formData: JSON.parse(JSON.stringify(initData)),
          validId: true
        },
        () => this.getVehicleData()
      )
    }
  }

  getVehicleData = () => {
    this.vehicleAPI
      .getVehicleData(this.props.kindId)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loading: false, formData: response.data }, () => this.checkCanSubmit())
        } else {
          message.error(response.message)
          this.history.push('/Parts/Vehicle')
        }
      })
      .catch(() => {
        message.error('Error!')
        this.history.push('/Parts/Vehicle')
      })
  }

  onInputChange = (event) => {
    const type = event.target.getAttribute('id')
    const text = event.target.value
    const { formData } = this.state
    formData[type] = text
    this.setState({ formData })
  }

  checkId = () => {
    const { formData } = this.state
    if (formData.kindId !== '') {
      this.setState({ validId: false }, () => {
        this.vehicleAPI.getVehicleData(formData.kindId).then((response) => {
          if (response.code === 0) {
            Modal.error({
              title: '此編號已重複，請重新輸入',
              icon: <ExclamationCircleOutlined />,
              okText: '確認',
              cancelText: null,
              onOk: () => {
                formData.kindId = ''
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

  // 新增
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      this.vehicleAPI
        .addVehicleData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              this.history.push('/Basic/Vehicle')
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
  // 修改
  handleSubmit = (back) => {
    this.setState({ loading: true }, () => {
      this.vehicleAPI
        .updateVehicleData(this.props.kindId, this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              this.history.push('/Parts/Vehicle')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getVehicleData()
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
        this.history.push('/Parts/Vehicle')
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
      lg: 12
    }
    return (
      <>
        <Breadcrumb style={{ marginBottom: 10 }}>
          <Breadcrumb.Item>
            <Link to='/Parts/Vehicle'>車種</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '新增車種' : '修改車種資料'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting}>
                <FormItem
                  title='車種代號'
                  content={
                    <Input
                      onBlur={this.checkId}
                      onChange={this.onInputChange}
                      value={this.state.formData.kindId}
                      id='kindId'
                      disabled={!this.props.createFlag}
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='車種名稱'
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
                  title='車種簡稱'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.shortName}
                      id='shortName'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='車廠'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.factory}
                      id='factory'
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
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={!this.state.validId}
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
                    onClick={this.handleSubmit.bind(this, false)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
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
