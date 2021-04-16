import React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  Spin,
  Card,
  Row,
  Col,
  Select,
  Input,
  InputNumber,
  AutoComplete,
  Upload,
  Space,
  Button,
  Modal,
  message
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, PhotoViewIcon, PhotoUploadIcon } from '../icon/Icon'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import { initData, additionData, formRules } from './productType'
import ProductAPI from '../../model/api/product'
import StaticStorage from '../../model/storage/static'
import moment from 'moment'

export default class ProductForm extends React.Component {
  history = createHashHistory()
  productAPI = new ProductAPI()
  productSearchTime = 0

  constructor(props) {
    super(props)
    this.state = {
      inited: false,
      loading: true,
      productType: [],
      formData: { ...initData },
      additionData: { ...additionData },
      picOpen: false,
      picUrl: '',
      formStatus: JSON.parse(JSON.stringify(formRules)),
      search: {
        partId: '',
        customCode1: '',
        customCode2: '',
        customCode3: '',
        productId: ''
      },
      partsList: [],
      kindsList: [],
      gradesList: [],
      colorsList: [],
      productList: [],
      productSearchLoading: false,
      canSubmit: false
    }
    this.getInitData().then(() => {
      if (!props.createFlag) {
        this.getProductData().then(() => this.setState({ inited: true, loading: false }))
      } else {
        this.setState({ inited: true, loading: false })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.createFlag && this.props.createFlag) ||
      (!prevProps.drawModeVisible && this.props.drawModeVisible) ||
      (!this.props.createFlag && prevProps.seqNo !== this.props.seqNo)
    ) {
      this.setState(
        {
          inited: false,
          loading: true,
          formData: { ...initData },
          additionData: { ...additionData },
          picOpen: false,
          picUrl: '',
          formStatus: JSON.parse(JSON.stringify(formRules)),
          search: {
            partId: '',
            customCode1: '',
            customCode2: '',
            customCode3: '',
            productId: ''
          },
          productList: [],
          productSearchLoading: false,
          canSubmit: false
        },
        () =>
          this.getInitData().then(() => {
            if (!this.props.createFlag) {
              this.getProductData().then(() => this.setState({ inited: true, loading: false }))
            } else {
              this.setState({ inited: true, loading: false })
            }
          })
      )
    }
  }

  getInitData = async () => {
    await new Promise((resolve) => {
      this.productAPI.getProductType().then((response) => {
        this.setState({ productType: response.data }, () => resolve(true))
      })
    })
    await new Promise((resolve) => {
      this.productAPI.getPartsList().then((response) => {
        this.setState({ partsList: response.data.list }, () => resolve(true))
      })
    })
    await new Promise((resolve) => {
      this.productAPI.getKindsList().then((response) => {
        this.setState({ kindsList: response.data.list }, () => resolve(true))
      })
    })
    await new Promise((resolve) => {
      this.productAPI.getGradesList().then((response) => {
        this.setState({ gradesList: response.data.list }, () => resolve(true))
      })
    })
    await new Promise((resolve) => {
      this.productAPI.getColorsList().then((response) => {
        this.setState({ colorsList: response.data.list }, () => resolve(true))
      })
    })
  }

  getProductData = async () => {
    await new Promise((resolve, reject) => {
      this.productAPI
        .getProductData(this.props.seqNo)
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
              this.history.push('/Products/List')
            }
          }
        })
        .catch(() => {
          reject(false)
          message.error('Error!')
          if (this.props.isDrawMode) {
            this.props.onClose()
          } else {
            this.history.push('/Products/List')
          }
        })
    })
    await new Promise((resolve) => {
      this.productAPI.getProductAdditionData(this.props.seqNo).then((response) => {
        if (response.code === 0) {
          const additionData = response.data
          if (response.data.productSeqNo !== 0) {
            this.productAPI
              .getProductData(response.data.productSeqNo)
              .then((response) => {
                if (response.code === 0) {
                  this.setState({ additionData, productList: [response.data] }, () =>
                    resolve(true)
                  )
                } else {
                  this.setState({ additionData }, () => resolve(true))
                }
              })
              .catch(() => this.setState({ additionData }, () => resolve(true)))
          } else {
            this.setState({ additionData }, () => resolve(true))
          }
        } else {
          resolve(true)
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

  // mapping product search & select
  onMappingSearch = (value) => {
    const { search } = this.state
    search.productId = value
    this.productSearchTime = moment().valueOf()
    this.setState({ search }, () => {
      setTimeout(() => {
        if (moment().valueOf() - this.productSearchTime >= 1000 && value !== '') {
          this.setState({ productSearchLoading: true }, () => {
            this.productAPI
              .getProductList({
                pageNum: 1,
                pageSize: 9999,
                productId: value,
                partId: '',
                customCode1: '',
                name: ''
              })
              .then((response) => {
                this.setState({ productList: response.data.list, productSearchLoading: false })
              })
              .catch(() => {
                this.setState({ productList: [], productSearchLoading: false })
              })
          })
        } else if (value === '') {
          this.setState({ productList: [] })
        }
      }, 1000)
    })
  }
  onMappingSelect = (value) => {
    const { search, formData, productList } = this.state
    const product = productList.find((product) => product.productId === value)
    if (product) {
      search.productId = ''
      formData.mappingProductId = product.productId
      formData.mappingProductSeqNo = product.seqNo
      this.setState({ search, productList: [product] }, () =>
        this.checkData(formData, 'mappingProductId')
      )
    }
  }

  // code select
  onCodeSearch = (key, value) => {
    if (!value.includes(' ')) {
      const { formData, search } = this.state
      if (key !== 'partId') {
        formData[key] = value.toUpperCase()
        formData.productId = `${formData.partId ? `${formData.partId}-` : ''}${
          formData.customCode1 ? `${formData.customCode1}-` : ''
        }${formData.customCode2 ? `${formData.customCode2}-` : ''}${
          formData.customCode3 ? formData.customCode3 : ''
        }`
      }
      search[key] = value.toUpperCase()
      this.setState({ search }, () => this.checkData(formData, key))
    }
  }
  onCodeSelect = (key, value) => {
    const { formData, search, kindsList } = this.state
    if (key === 'partId') {
      search.partId = ''
    } else {
      search[key] = value
    }
    formData[key] = value
    if (key === 'customCode1') {
      const kind = kindsList.find((kind) => kind.kindId.toLowerCase() === value.toLowerCase())
      if (kind) formData.kindShortName = kind.shortName
    }
    formData.productId = `${formData.partId ? `${formData.partId}-` : ''}${
      formData.customCode1 ? `${formData.customCode1}-` : ''
    }${formData.customCode2 ? `${formData.customCode2}-` : ''}${
      formData.customCode3 ? formData.customCode3 : ''
    }`
    this.setState({ search }, () => this.checkData(formData, key))
  }
  // get code options
  getPartOptions = () => {
    const { formData, search, partsList } = this.state
    return partsList
      .filter(
        (part) =>
          formData.partId === part.partId ||
          (search.partId && part.partId.toLowerCase().includes(search.partId.toLowerCase()))
      )
      .map((part) => {
        return {
          label: `${part.partId} - ${part.name}`,
          value: part.partId
        }
      })
  }
  getKindOptions = () => {
    const { formData, search, kindsList } = this.state
    const kinds = kindsList.filter(
      (kind) =>
        formData.kindId === kind.kindId ||
        (search.customCode1 && kind.kindId.toLowerCase().includes(search.customCode1.toLowerCase()))
    )
    if (search.customCode1 && !kinds.find((kind) => kind.kindId === search.customCode1)) {
      kinds.unshift({ kindId: search.customCode1, name: '自訂代碼1' })
    }
    return kinds.map((kind) => {
      return {
        label: `${kind.kindId} - ${kind.name}`,
        value: kind.kindId
      }
    })
  }
  getGradeOptions = () => {
    const { formData, search, gradesList } = this.state
    const grades = gradesList.filter(
      (grade) =>
        formData.gradeId === grade.gradeId ||
        (search.customCode2 &&
          grade.gradeId.toLowerCase().includes(search.customCode2.toLowerCase()))
    )
    if (search.customCode2 && !grades.find((grade) => grade.gradeId === search.customCode2)) {
      grades.unshift({ gradeId: search.customCode2, name: '自訂代碼2' })
    }
    return grades.map((grade) => {
      return {
        label: `${grade.gradeId} - ${grade.name}`,
        value: grade.gradeId
      }
    })
  }
  getColorOptions = () => {
    const { formData, search, colorsList } = this.state
    const colors = colorsList.filter(
      (color) =>
        formData.colorId === color.colorId ||
        (search.customCode3 &&
          color.colorId.toLowerCase().includes(search.customCode3.toLowerCase()))
    )
    if (search.customCode3 && !colors.find((color) => color.colorId === search.customCode3)) {
      colors.unshift({ colorId: search.customCode3, name: '自訂代碼3' })
    }
    return colors.map((color) => {
      return {
        label: `${color.colorId} - ${color.name}`,
        value: color.colorId
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

  openPic = (key) => {
    const { additionData } = this.state
    const picUrl = additionData[key]
    this.setState({ picOpen: true, picUrl })
  }

  // 上傳照片
  onPicUpload = (picEnum, file) => {
    this.setState({ loading: true }, () => {
      const data = new FormData()
      data.append('file', file)
      this.productAPI.uploadProductPic(this.props.seqNo, picEnum, data).then((response) => {
        console.log(response)
        if (response.code === 0) {
          message.success('照片上傳成功')
          this.productAPI.getProductAdditionData(this.props.seqNo).then((response) => {
            if (response.code === 0) {
              this.setState({ loading: false, additionData: response.data })
            } else {
              this.setState({ loading: false })
            }
          })
        } else {
          message.error('照片上傳失敗')
        }
      })
    })
    return false
  }

  // 新增
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      this.productAPI
        .addProductData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Products/List')
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
                  partId: '',
                  customCode1: '',
                  customCode2: '',
                  customCode3: ''
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
      this.productAPI
        .updateProductData(this.state.formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Products/List')
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

  handleCancel = () => {
    if (this.props.isDrawMode) {
      this.props.onClose()
    } else {
      this.history.push('/Products/List')
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
          lg: 12
        }
    const colSetting3 = { span: 24 }
    const codeColSetting = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12
    }
    const picColSetting = this.props.isDrawMode
      ? {
          span: 12
        }
      : {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        }
    return (
      <>
        {!this.props.isDrawMode && (
          <Breadcrumb style={{ marginBottom: 10 }}>
            <Breadcrumb.Item>
              <Link to='/Products/List'>商品</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.createFlag ? '新增商品' : '修改商品資料'}</Breadcrumb.Item>
          </Breadcrumb>
        )}
        <Spin spinning={this.state.loading} className='product-spinning'>
          {this.state.inited && (
            <>
              <Card className='form-detail-card'>
                <Row {...rowSetting}>
                  <Col {...colSetting3}>
                    <FormItem
                      required={false}
                      title='商品編號'
                      content={<Input value={this.state.formData.productId} disabled={true} />}
                    />
                  </Col>
                  <Col {...colSetting3}>
                    <FormItem
                      required={true}
                      title='商品種類'
                      content={
                        <Select
                          value={this.state.formData.productType}
                          onChange={this.onSelectChange.bind(this, 'productType')}
                          disabled={!this.props.createFlag}
                          style={{ width: '100%' }}
                        >
                          {this.state.productType.map((type) => (
                            <Select.Option key={type.productType} value={type.productType}>
                              {type.desc}
                            </Select.Option>
                          ))}
                        </Select>
                      }
                    />
                  </Col>
                  <Col {...colSetting3}>
                    <FormItem
                      required={true}
                      title='代碼'
                      align='flex-start'
                      content={
                        <Row gutter={[12]} className='product-code-row'>
                          <Col {...codeColSetting}>
                            <Select
                              placeholder='零件編號'
                              value={this.state.formData.partId}
                              searchValue={this.state.search.partId}
                              showSearch={true}
                              showArrow={false}
                              options={this.getPartOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'partId')}
                              onSelect={this.onCodeSelect.bind(this, 'partId')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                            />
                          </Col>
                          <Col {...codeColSetting}>
                            <AutoComplete
                              placeholder='車種或自訂代碼1'
                              value={this.state.formData.customCode1}
                              options={this.getKindOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'customCode1')}
                              onSelect={this.onCodeSelect.bind(this, 'customCode1')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                            />
                          </Col>
                          <Col {...codeColSetting}>
                            <AutoComplete
                              placeholder='等級或自訂代碼2'
                              value={this.state.formData.customCode2}
                              options={this.getGradeOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'customCode2')}
                              onSelect={this.onCodeSelect.bind(this, 'customCode2')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                            />
                          </Col>
                          <Col {...codeColSetting}>
                            <AutoComplete
                              placeholder='顏色或自訂代碼3'
                              value={this.state.formData.customCode3}
                              options={this.getColorOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'customCode3')}
                              onSelect={this.onCodeSelect.bind(this, 'customCode3')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                            />
                          </Col>
                        </Row>
                      }
                      message='零件編號為必填'
                      error={this.getFormErrorStatus('partId')}
                    />
                  </Col>
                  <Col {...colSetting2}>
                    <FormItem
                      required={false}
                      title='車種'
                      content={
                        <Input
                          onChange={this.onInputChange}
                          value={this.state.formData.kindShortName}
                          id='kindShortName'
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting2}>
                    <FormItem
                      required={false}
                      title='單位'
                      content={
                        <Select
                          onChange={this.onSelectChange.bind(this, 'unit')}
                          value={this.state.formData.unit}
                          options={StaticStorage.unitList.map((unit) => {
                            return {
                              label: unit.desc,
                              value: unit.unit
                            }
                          })}
                          optionFilterProp='children'
                          style={{ width: '100%' }}
                        />
                      }
                    />
                  </Col>
                  <Col {...colSetting3}>
                    <FormItem
                      required={true}
                      title='商品名稱'
                      content={
                        <Input
                          onChange={this.onInputChange}
                          value={this.state.formData.name}
                          id='name'
                        />
                      }
                      message='商品名稱為必填'
                      error={this.getFormErrorStatus('name')}
                    />
                  </Col>
                  {this.state.formData.productType === 'VIRTUAL' ? (
                    <Col {...colSetting3}>
                      <FormItem
                        required={true}
                        title='對應料號'
                        content={
                          <Spin spinning={this.state.productSearchLoading}>
                            <Select
                              showSearch={true}
                              value={this.state.formData.mappingProductId}
                              searchValue={this.state.search.productId}
                              onSearch={this.onMappingSearch}
                              onSelect={this.onMappingSelect}
                              optionFilterProp='children'
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              suffixIcon={null}
                            >
                              {this.state.productList.map((product) => (
                                <Select.Option key={product.productId} value={product.productId}>
                                  {product.productId} ({product.name})
                                </Select.Option>
                              ))}
                            </Select>
                          </Spin>
                        }
                        message='對應料號為必選'
                        error={this.getFormErrorStatus('mappingProductId')}
                      />
                    </Col>
                  ) : (
                    <>
                      <Col {...colSetting1}>
                        <FormItem
                          required={true}
                          title='定價1'
                          content={
                            <InputNumber
                              onChange={this.onNumberChange.bind(this, 'price1')}
                              value={this.state.formData.price1}
                              min={0}
                              max={99999999}
                              step={1}
                              style={{ display: 'block', width: '100%' }}
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting1}>
                        <FormItem
                          required={false}
                          title='定價2'
                          content={
                            <InputNumber
                              onChange={this.onNumberChange.bind(this, 'price2')}
                              value={this.state.formData.price2}
                              min={0}
                              max={99999999}
                              step={1}
                              style={{ display: 'block', width: '100%' }}
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting1}>
                        <FormItem
                          required={false}
                          title='定價3'
                          content={
                            <InputNumber
                              onChange={this.onNumberChange.bind(this, 'price3')}
                              value={this.state.formData.price3}
                              min={0}
                              max={99999999}
                              step={1}
                              style={{ display: 'block', width: '100%' }}
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting2}>
                        <FormItem
                          required={false}
                          title='規格'
                          content={
                            <Input
                              onChange={this.onInputChange}
                              value={this.state.formData.norm}
                              id='norm'
                            />
                          }
                        />
                      </Col>
                    </>
                  )}
                  {this.state.formData.productType === 'REAL' && (
                    <>
                      <Col {...colSetting2}>
                        <FormItem
                          required={false}
                          title='原廠料號'
                          content={
                            <Input
                              onChange={this.onInputChange}
                              value={this.state.formData.vendorProductId}
                              id='vendorProductId'
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting1}>
                        <FormItem
                          required={false}
                          title='安全量'
                          content={
                            <InputNumber
                              onChange={this.onNumberChange.bind(this, 'safetyStock')}
                              value={this.state.formData.safetyStock}
                              min={0}
                              max={999999}
                              step={1}
                              style={{ display: 'block', width: '100%' }}
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting1}>
                        <FormItem
                          required={false}
                          title='庫存量'
                          content={
                            <InputNumber
                              onChange={this.onNumberChange.bind(this, 'inventory')}
                              value={this.state.formData.inventory}
                              min={0}
                              max={999999}
                              step={1}
                              style={{ display: 'block', width: '100%' }}
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting1}>
                        <FormItem
                          required={false}
                          title='庫存地點'
                          content={
                            <Input
                              onChange={this.onInputChange}
                              value={this.state.formData.storingPlace}
                              id='storingPlace'
                            />
                          }
                        />
                      </Col>
                    </>
                  )}
                </Row>
              </Card>
              <Card className='form-detail-card'>
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
              {this.state.formData.productType === 'REAL' && (
                <Card className='form-detail-card'>
                  <Row {...rowSetting}>
                    <Col span={24}>
                      <p className='product-real-pictitle'>商品照片</p>
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic1Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic1Url} alt='照片1' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic1Url')}>
                              <PhotoViewIcon />
                            </Button>
                            <Upload
                              showUploadList={false}
                              beforeUpload={this.onPicUpload.bind(this, 'PIC1')}
                            >
                              <Button>
                                <PhotoUploadIcon />
                              </Button>
                            </Upload>
                          </div>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC1')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>上傳照片</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic2Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic2Url} alt='照片2' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic2Url')}>
                              <PhotoViewIcon />
                            </Button>
                            <Upload
                              showUploadList={false}
                              beforeUpload={this.onPicUpload.bind(this, 'PIC2')}
                            >
                              <Button>
                                <PhotoUploadIcon />
                              </Button>
                            </Upload>
                          </div>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC2')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>上傳照片</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic3Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic3Url} alt='照片3' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic3Url')}>
                              <PhotoViewIcon />
                            </Button>
                            <Upload
                              showUploadList={false}
                              beforeUpload={this.onPicUpload.bind(this, 'PIC3')}
                            >
                              <Button>
                                <PhotoUploadIcon />
                              </Button>
                            </Upload>
                          </div>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC3')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>上傳照片</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic4Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic4Url} alt='照片4' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic4Url')}>
                              <PhotoViewIcon />
                            </Button>
                            <Upload
                              showUploadList={false}
                              beforeUpload={this.onPicUpload.bind(this, 'PIC4')}
                            >
                              <Button>
                                <PhotoUploadIcon />
                              </Button>
                            </Upload>
                          </div>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC4')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>上傳照片</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                  </Row>
                  <Modal
                    className='product-real-pic-modal'
                    visible={this.state.picOpen}
                    title={null}
                    footer={null}
                    onCancel={() => this.setState({ picOpen: false })}
                  >
                    <img src={this.state.picUrl} alt='照片放大' />
                  </Modal>
                </Card>
              )}
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
            </>
          )}
        </Spin>
      </>
    )
  }
}
