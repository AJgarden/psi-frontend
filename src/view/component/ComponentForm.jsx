import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, Row, Input, Button, Space, Modal, Spin, message } from 'antd'
import { FormItem } from '../../component/FormItem'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { createHashHistory } from 'history'
import { initData, formRules } from './componentType'
import ComponentAPI from '../../model/api/component'

export default class ComponentForm extends React.Component {
  history = createHashHistory()
  componentAPI = new ComponentAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: { ...initData },
      formStatus: JSON.parse(JSON.stringify(formRules)),
      validId: false,
      canSubmit: false
    }
    if (!props.createFlag) {
      this.getComponentData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({
        loading: false,
        formData: { ...initData },
        formStatus: JSON.parse(JSON.stringify(formRules)),
        validId: false,
        canSubmit: false
      })
    } else if (!this.props.createFlag && prevProps.partId !== this.props.partId) {
      this.setState(
        {
          loading: true,
          formData: { ...initData },
          formStatus: JSON.parse(JSON.stringify(formRules)),
          validId: true,
          canSubmit: false
        },
        () => this.getComponentData()
      )
    }
  }

  getComponentData = () => {
    this.componentAPI
      .getComponentData(this.props.partId)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loading: false, formData: response.data }, () => this.checkCanSubmit())
        } else {
          message.error(response.message)
          this.history.push('/Parts/Component')
        }
      })
      .catch(() => {
        message.error('Error!')
        this.history.push('/Parts/Component')
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

  checkId = () => {
    const { formData } = this.state
    if (formData.partId !== '') {
      this.setState({ validId: false }, () => {
        this.componentAPI.getComponentData(formData.partId).then((response) => {
          if (response.code === 0) {
            Modal.error({
              title: '此編號已重複，請重新輸入',
              icon: <ExclamationCircleOutlined />,
              okText: '確認',
              cancelText: null,
              onOk: () => {
                formData.partId = ''
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
      this.componentAPI
        .addComponentData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              this.history.push('/Basic/Level')
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
      this.componentAPI
        .updateComponentData(this.props.partId, this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              this.history.push('/Parts/Component')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getComponentData()
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
        this.history.push('/Parts/Component')
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
            <Link to='/Parts/Component'>零件</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.createFlag ? '新增零件' : '修改零件資料'}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting}>
                <FormItem
                  required={true}
                  title='零件代號'
                  content={
                    <Input
                      onBlur={this.checkId}
                      onChange={this.onInputChange}
                      value={this.state.formData.partId}
                      id='partId'
                      disabled={!this.props.createFlag}
                    />
                  }
                  message='零件代號為必填,長度需在4字內'
                  error={this.getFormErrorStatus('partId')}
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  required={true}
                  title='零件名稱'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.name}
                      id='name'
                    />
                  }
                  message='零件名稱為必填,長度需在10字'
                  error={this.getFormErrorStatus('name')}
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
                    disabled={!this.state.validId}
                    onClick={this.handleCreate.bind(this, true)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    // disabled={!this.state.canSubmit}
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