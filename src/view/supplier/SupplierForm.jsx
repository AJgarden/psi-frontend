import React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Col, Row, Input, Button, Space, Modal, Spin, message } from 'antd'
import { FormItem } from '../../component/FormItem'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { createHashHistory } from 'history'
import { initData } from './supplierType'
// import addressDistrict from '../../model/resource/addressDistrict.json'
import SupplierAPI from '../../model/api/supplier'

export default class SupplierForm extends React.Component {
  history = createHashHistory()
  supplierAPI = new SupplierAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: !props.createFlag,
      formData: JSON.parse(JSON.stringify(initData)),
      validId: false
    }
    if (!props.createFlag) {
      this.getSupplierData()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.createFlag && this.props.createFlag) {
      this.setState({
        loading: false,
        formData: JSON.parse(JSON.stringify(initData)),
        validId: false,
        canSubmit: false
      })
    } else if (!this.props.createFlag && prevProps.vendorId !== this.props.vendorId) {
      this.setState(
        {
          loading: true,
          formData: JSON.parse(JSON.stringify(initData)),
          validId: true,
          canSubmit: false
        },
        () => this.getSupplierData()
      )
    }
  }

  getSupplierData = () => {
    this.supplierAPI
      .getSupplierData(this.props.vendorId)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loading: false, formData: response.data })
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

  onInputChange = (event) => {
    const type = event.target.getAttribute('id')
    const text = event.target.value
    const { formData } = this.state
    formData[type] = type === 'vendorId' ? text.toUpperCase() : text
    this.setState({ formData })
  }

  checkId = () => {
    const { formData } = this.state
    if (formData.vendorId !== '') {
      this.setState({ validId: false }, () => {
        this.supplierAPI.getSupplierData(formData.vendorId).then((response) => {
          if (response.code === 0) {
            Modal.error({
              title: '????????????????????????????????????',
              icon: <ExclamationCircleOutlined />,
              okText: '??????',
              cancelText: null,
              onOk: () => {
                formData.vendorId = ''
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
      this.supplierAPI
        .addSupplierData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('??????????????????')
            if (back) {
              this.history.push('/Basic/Supplier')
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
      this.supplierAPI
        .updateSupplierData(this.props.vendorId, this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('??????????????????')
            if (back) {
              this.history.push('/Basic/Supplier')
            } else {
              const layoutContent = document.getElementById('layout-content-wrapper')
              layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getSupplierData()
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
        .catch(() => {
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
            <Link to='/Basic/Supplier'>??????</Link>
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
                      value={this.state.formData.vendorId}
                      id='vendorId'
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
                      value={this.state.formData.name}
                      id='name'
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
                      value={this.state.formData.shortName}
                      id='shortName'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='?????????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.principal}
                      id='principal'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='?????????'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.contactPerson}
                      id='contactPerson'
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
                      value={this.state.formData.faxNumber}
                      id='faxNumber'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='??????1'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.phone1}
                      id='phone1'
                    />
                  }
                />
              </Col>
              <Col {...colSetting}>
                <FormItem
                  title='??????2'
                  content={
                    <Input
                      onChange={this.onInputChange}
                      value={this.state.formData.phone2}
                      id='phone2'
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
                  title='??????1'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note1}
                      id='note1'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                    />
                  }
                />
              </Col>
              <Col span={24}>
                <FormItem
                  align='flex-start'
                  title='??????2'
                  content={
                    <Input.TextArea
                      onChange={this.onInputChange}
                      value={this.state.formData.note2}
                      id='note2'
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
