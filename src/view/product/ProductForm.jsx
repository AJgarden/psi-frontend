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
import { initData, additionData } from './productType'
import SelectProductModal from './SelectProductModal'
import ProductAPI from '../../model/api/product'
import StaticStorage from '../../model/storage/static'

export default class ProductForm extends React.Component {
  history = createHashHistory()
  productAPI = new ProductAPI()
  productSearchTime = 0

  constructor(props) {
    super(props)
    const formData = JSON.parse(JSON.stringify(initData))
    if (StaticStorage.unitList.length > 0) {
      formData.unit = StaticStorage.unitList[0].unit
    }
    this.state = {
      inited: false,
      loading: true,
      productType: [],
      formData,
      additionData: { ...additionData },
      picOpen: false,
      picUrl: '',
      search: {
        partId: '',
        customCode1: '',
        customCode2: '',
        customCode3: ''
      },
      codeSelect: {
        part: null,
        kind: null,
        grade: null,
        color: null
      },
      partsList: [],
      kindsList: [],
      gradesList: [],
      colorsList: [],
      selectVisible: false
    }
    if (!props.createFlag) {
      this.getInitData(false).then(() =>
        this.getProductData().then(() => this.setState({ inited: true, loading: false }))
      )
    } else {
      this.getInitData(true).then(() => this.setState({ inited: true, loading: false }))
    }
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.createFlag && this.props.createFlag) ||
      (!prevProps.drawModeVisible && this.props.drawModeVisible) ||
      (!this.props.createFlag && prevProps.seqNo !== this.props.seqNo)
    ) {
      const formData = JSON.parse(JSON.stringify(initData))
      if (StaticStorage.unitList.length > 0) {
        formData.unit = StaticStorage.unitList[0].unit
      }
      this.setState(
        {
          inited: false,
          loading: true,
          formData,
          additionData: { ...additionData },
          picOpen: false,
          picUrl: '',
          search: {
            partId: '',
            customCode1: '',
            customCode2: '',
            customCode3: ''
          },
          selectVisible: false
        },
        () => {
          if (!this.props.createFlag) {
            this.getInitData(false).then(() =>
              this.getProductData().then(() => this.setState({ inited: true, loading: false }))
            )
          } else {
            this.getInitData(true).then(() => this.setState({ inited: true, loading: false }))
          }
        }
      )
    }
  }

  getInitData = async (isCreate) => {
    await new Promise((resolve) => {
      this.productAPI.getProductType().then((response) => {
        this.setState({ productType: response.data }, () => resolve(true))
      })
    })
    if (isCreate) {
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
  }

  getProductData = async () => {
    await new Promise((resolve, reject) => {
      this.productAPI
        .getProductData(this.props.seqNo)
        .then((response) => {
          if (response.code === 0) {
            this.setState({ formData: response.data }, () => resolve(true))
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
    if (this.state.formData.productType === 'REAL') {
      await new Promise((resolve) => {
        this.productAPI
          .getProductAdditionData(this.props.seqNo)
          .then((response) => {
            if (response.code === 0) {
              this.setState({ additionData: response.data }, () => resolve(true))
            } else {
              resolve(true)
            }
          })
          .catch(() => resolve(true))
      })
    }
  }

  onTypeChange = (value) => {
    const { formData } = this.state
    formData.productType = value
    this.setState(
      {
        loading: value === 'REAL' && formData.seqNo !== 0,
        formData
      },
      () => {
        if (value === 'REAL' && formData.seqNo !== 0) {
          this.productAPI.getProductAdditionData(formData.seqNo).then((response) => {
            if (response.code === 0) {
              this.setState({ loading: false, additionData: response.data })
            }
          })
        }
      }
    )
  }
  onInputChange = (event) => {
    const type = event.target.getAttribute('id')
    const text = event.target.value
    const { formData } = this.state
    formData[type] = text
    this.setState({ formData })
  }
  onSelectChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.setState({ formData })
  }
  onNumberChange = (type, value) => {
    const { formData } = this.state
    formData[type] = value
    this.setState({ formData })
  }

  onSwitchProductModal = () => {
    this.setState({ selectVisible: !this.state.selectVisible })
  }
  onMappingSelect = (product) => {
    console.log(product)
    const { formData } = this.state
    formData.mappingProductId = product.data
    formData.mappingProductSeqNo = product.productSeqNo
    this.setState({ formData, selectVisible: false })
  }

  // code select
  onCodeSearch = (key, value) => {
    if (!value.includes(' ')) {
      const { formData, search } = this.state
      if (key !== 'partId') {
        formData[key] = value.toUpperCase()
        let productId = ''
        productId += formData.partId ? formData.partId : ''
        productId += formData.customCode1
          ? productId !== ''
            ? `-${formData.customCode1}`
            : formData.customCode1
          : ''
        productId += formData.customCode2
          ? productId !== ''
            ? `-${formData.customCode2}`
            : formData.customCode2
          : ''
        productId += formData.customCode3
          ? productId !== ''
            ? `-${formData.customCode3}`
            : formData.customCode3
          : ''
        formData.productId = productId
      }
      search[key] = value.toUpperCase()
      this.setState({ search, formData })
    }
  }
  onCodeSelect = (key, value, option) => {
    const { formData, search, codeSelect, kindsList } = this.state
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
    if (key === 'partId') codeSelect.part = option
    else if (key === 'customCode1') codeSelect.kind = option
    else if (key === 'customCode2') codeSelect.grade = option
    else if (key === 'customCode3') codeSelect.color = option
    formData.productId = this.generateProductIdName().productId
    formData.name = this.generateProductIdName().productName
    this.setState({ search, codeSelect, formData })
  }
  onCodeClear = (key) => {
    const { formData, search, codeSelect } = this.state
    formData[key] = ''
    search[key] = ''
    if (key === 'customCode1') formData.kindShortName = ''
    if (key === 'partId') codeSelect.part = null
    else if (key === 'customCode1') codeSelect.kind = null
    else if (key === 'customCode2') codeSelect.grade = null
    else if (key === 'customCode3') codeSelect.color = null
    formData.productId = this.generateProductIdName().productId
    formData.name = this.generateProductIdName().productName
    this.setState({ search, formData })
  }
  generateProductIdName = () => {
    const { codeSelect } = this.state
    let productId = ''
    let productName = ''
    if (codeSelect.part) {
      productId += codeSelect.part.value
      productName += codeSelect.part.name
    }
    if (codeSelect.kind) {
      productId += productId !== '' ? `-${codeSelect.kind.value}` : codeSelect.kind.value
      productName +=
        codeSelect.kind.name !== ''
          ? productName !== ''
            ? `-${codeSelect.kind.name}`
            : codeSelect.kind.name
          : ''
    }
    if (codeSelect.grade) {
      productId += productId !== '' ? `-${codeSelect.grade.value}` : codeSelect.grade.value
      productName +=
        codeSelect.grade.name !== ''
          ? productName !== ''
            ? `-${codeSelect.grade.name}`
            : codeSelect.grade.name
          : ''
    }
    if (codeSelect.color) {
      productId += productId !== '' ? `-${codeSelect.color.value}` : codeSelect.color.value
      productName +=
        codeSelect.color.name !== ''
          ? productName !== ''
            ? `-${codeSelect.color.name}`
            : codeSelect.color.name
          : ''
    }
    return { productId, productName }
  }
  // get code options
  getPartOptions = () => {
    const { formData, search, partsList } = this.state
    if (search.partId === '') {
      return partsList.map((part) => {
        return {
          label: `${part.partId} - ${part.name}`,
          value: part.partId,
          name: part.name
        }
      })
    } else {
      return partsList
        .filter(
          (part) =>
            formData.partId === part.partId ||
            (search.partId && part.partId.toLowerCase().startsWith(search.partId.toLowerCase()))
        )
        .map((part) => {
          return {
            label: `${part.partId} - ${part.name}`,
            value: part.partId,
            name: part.name
          }
        })
    }
  }
  getKindOptions = () => {
    const { formData, search, kindsList } = this.state
    if (search.customCode1 === '') {
      return kindsList.map((kind) => {
        return {
          label: `${kind.kindId} - ${kind.name}`,
          value: kind.kindId,
          name: kind.name
        }
      })
    } else {
      const kinds = kindsList.filter(
        (kind) =>
          formData.customCode1 === kind.kindId ||
          (search.customCode1 &&
            kind.kindId.toLowerCase().startsWith(search.customCode1.toLowerCase()))
      )
      if (search.customCode1 && !kinds.find((kind) => kind.kindId === search.customCode1)) {
        kinds.unshift({ kindId: search.customCode1, name: '' })
      }
      return kinds.map((kind) => {
        return {
          label: kind.name !== '' ? `${kind.kindId} - ${kind.name}` : kind.kindId,
          value: kind.kindId,
          name: kind.name
        }
      })
    }
  }
  getGradeOptions = () => {
    const { formData, search, gradesList } = this.state
    if (search.customCode2 === '') {
      return gradesList.map((grade) => {
        return {
          label: `${grade.gradeId} - ${grade.name}`,
          value: grade.gradeId,
          name: grade.name
        }
      })
    } else {
      const grades = gradesList.filter(
        (grade) =>
          formData.customCode2 === grade.gradeId ||
          (search.customCode2 &&
            grade.gradeId.toLowerCase().startsWith(search.customCode2.toLowerCase()))
      )
      if (search.customCode2 && !grades.find((grade) => grade.gradeId === search.customCode2)) {
        grades.unshift({ gradeId: search.customCode2, name: '' })
      }
      return grades.map((grade) => {
        return {
          label: grade.name !== '' ? `${grade.gradeId} - ${grade.name}` : grade.gradeId,
          value: grade.gradeId,
          name: grade.name
        }
      })
    }
  }
  getColorOptions = () => {
    const { formData, search, colorsList } = this.state
    if (search.customCode3 === '') {
      return colorsList.map((color) => {
        return {
          label: `${color.colorId} - ${color.name}`,
          value: color.colorId,
          name: color.name
        }
      })
    } else {
      const colors = colorsList.filter(
        (color) =>
          formData.customCode3 === color.colorId ||
          (search.customCode3 &&
            color.colorId.toLowerCase().includes(search.customCode3.toLowerCase()))
      )
      if (search.customCode3 && !colors.find((color) => color.colorId === search.customCode3)) {
        colors.unshift({ colorId: search.customCode3, name: '' })
      }
      return colors.map((color) => {
        return {
          label: color.name !== '' ? `${color.colorId} - ${color.name}` : color.colorId,
          value: color.colorId,
          name: color.name
        }
      })
    }
  }

  onAdditionNumberChange = (type, value) => {
    const { additionData } = this.state
    additionData[type] = value
    this.setState({ additionData })
  }

  openPic = (key) => {
    const { additionData } = this.state
    const picUrl = additionData[key]
    this.setState({ picOpen: true, picUrl })
  }

  // ????????????
  onPicUpload = (picEnum, file) => {
    if (file.size > 10485760) {
      message.error('??????????????????10MB')
    } else {
      this.setState({ loading: true }, () => {
        const data = new FormData()
        data.append('file', file)
        this.productAPI.uploadProductPic(this.props.seqNo, picEnum, data).then((response) => {
          if (response.code === 0) {
            message.success('??????????????????')
            this.productAPI.getProductAdditionData(this.props.seqNo).then((response) => {
              if (response.code === 0) {
                this.setState({ loading: false, additionData: response.data })
              } else {
                this.setState({ loading: false })
              }
            })
          } else {
            message.error('??????????????????')
          }
        })
      })
    }
    return false
  }

  // ??????
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      const data = { ...this.state.formData }
      delete data.productId
      this.productAPI
        .addProductData(data)
        .then((response) => {
          if (response.code === 0) {
            this.updateAddition(data.productType, response.data.seqNo)
              .then((response) => {
                message.success('??????????????????')
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
                    formData: JSON.parse(JSON.stringify(initData)),
                    search: {
                      partId: '',
                      customCode1: '',
                      customCode2: '',
                      customCode3: ''
                    }
                  })
                }
              })
              .catch((error) => message.error(error))
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
      const data = { ...this.state.formData }
      delete data.productId
      this.productAPI
        .updateProductData(data)
        .then((response) => {
          if (response.code === 0) {
            this.updateAddition(data.productType, data.seqNo)
              .then(() => {
                message.success('??????????????????')
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
                  this.getProductData().then(() => this.setState({ loading: false }))
                }
              })
              .catch((error) => message.error(error))
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
  updateAddition = async (type, seqNo) => {
    if (type === 'REAL') {
      const { additionData } = this.state
      const data = {
        length: additionData.length,
        width: additionData.width,
        height: additionData.height,
        weight: additionData.weight
      }
      return new Promise((resolve, reject) => {
        this.productAPI
          .updateProductAdditionData(seqNo, data)
          .then((response) => {
            if (response.code === 0) {
              resolve(true)
            } else {
              reject(response.message)
            }
          })
          .catch((error) => {
            reject(error.data.message)
          })
      })
    } else {
      return Promise.resolve(true)
    }
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
    const addColSetting = this.props.isDrawMode
      ? {
          span: 12
        }
      : {
          xs: 24,
          sm: 24,
          md: 12,
          lg: 12
        }
    const picColSetting = this.props.isDrawMode
      ? {
          span: 6
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
              <Link to='/Products/List'>??????</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.createFlag ? '????????????' : '??????????????????'}</Breadcrumb.Item>
          </Breadcrumb>
        )}
        <Spin spinning={this.state.loading} className='product-spinning'>
          {this.state.inited && (
            <>
              <Card className='form-detail-card'>
                <Row {...rowSetting}>
                  <Col {...colSetting3}>
                    <FormItem
                      title='????????????'
                      content={<Input value={this.state.formData.productId} disabled={true} />}
                    />
                  </Col>
                  <Col {...colSetting3}>
                    <FormItem
                      title='????????????'
                      content={
                        <Select
                          value={this.state.formData.productType}
                          // onChange={this.onSelectChange.bind(this, 'productType')}
                          onChange={this.onTypeChange}
                          // disabled={!this.props.createFlag}
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
                      title='??????'
                      align='flex-start'
                      content={
                        <Row gutter={[12]} className='product-code-row'>
                          <Col {...codeColSetting}>
                            <Select
                              placeholder='????????????'
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
                              className='product-search'
                            />
                          </Col>
                          <Col {...codeColSetting}>
                            <Select
                              placeholder='?????????????????????1'
                              value={
                                this.state.formData.customCode1 === ''
                                  ? null
                                  : this.state.formData.customCode1
                              }
                              showSearch={true}
                              showArrow={false}
                              allowClear={true}
                              options={this.getKindOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'customCode1')}
                              onSelect={this.onCodeSelect.bind(this, 'customCode1')}
                              onClear={this.onCodeClear.bind(this, 'customCode1')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                              className='product-search'
                            />
                          </Col>
                          <Col {...codeColSetting}>
                            <Select
                              placeholder='?????????????????????2'
                              value={
                                this.state.formData.customCode2 === ''
                                  ? null
                                  : this.state.formData.customCode2
                              }
                              showSearch={true}
                              showArrow={false}
                              allowClear={true}
                              options={this.getGradeOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'customCode2')}
                              onSelect={this.onCodeSelect.bind(this, 'customCode2')}
                              onClear={this.onCodeClear.bind(this, 'customCode2')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                              className='product-search'
                            />
                          </Col>
                          <Col {...codeColSetting}>
                            <Select
                              placeholder='?????????????????????3'
                              value={
                                this.state.formData.customCode3 === ''
                                  ? null
                                  : this.state.formData.customCode3
                              }
                              showSearch={true}
                              showArrow={false}
                              allowClear={true}
                              options={this.getColorOptions()}
                              onSearch={this.onCodeSearch.bind(this, 'customCode3')}
                              onSelect={this.onCodeSelect.bind(this, 'customCode3')}
                              onClear={this.onCodeClear.bind(this, 'customCode3')}
                              style={{ width: '100%' }}
                              notFoundContent={null}
                              disabled={!this.props.createFlag}
                              className='product-search'
                            />
                          </Col>
                        </Row>
                      }
                    />
                  </Col>
                  <Col {...colSetting2}>
                    <FormItem
                      title='??????'
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
                      title='??????'
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
                  {this.state.formData.productType === 'VIRTUAL' ? (
                    <Col {...colSetting3}>
                      <FormItem
                        title='????????????'
                        content={
                          <Button
                            onClick={this.onSwitchProductModal}
                            type={this.state.formData.mappingProductId === '' ? 'primary' : 'default'}
                            style={{ width: '100%' }}
                          >
                            {this.state.formData.mappingProductId === '' ? '????????????' : this.state.formData.mappingProductId}
                          </Button>
                        }
                      />
                      <SelectProductModal
                        type='sale'
                        visible={this.state.selectVisible}
                        value={this.state.formData.mappingProductId}
                        onSelect={this.onMappingSelect}
                        onClose={this.onSwitchProductModal}
                      />
                    </Col>
                  ) : (
                    <>
                      <Col {...colSetting1}>
                        <FormItem
                          title='??????1'
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
                          title='??????2'
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
                          title='??????3'
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
                          title='??????'
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
                          title='????????????'
                          content={
                            <Input
                              onChange={this.onInputChange}
                              value={this.state.formData.vendorProductId}
                              id='vendorProductId'
                            />
                          }
                        />
                      </Col>
                      <Col {...colSetting2}>
                        <FormItem
                          title='?????????'
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
                      {/* <Col {...colSetting1}>
                        <FormItem
                          title='?????????'
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
                      </Col> */}
                      <Col {...colSetting2}>
                        <FormItem
                          title='????????????'
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
              {this.state.formData.productType === 'REAL' && (
                <Card className='form-detail-card'>
                  <Row {...rowSetting}>
                    <Col {...addColSetting}>
                      <FormItem
                        title='???(cm)'
                        content={
                          <InputNumber
                            onChange={this.onAdditionNumberChange.bind(this, 'length')}
                            value={this.state.additionData.length}
                            min={0}
                            max={999999}
                            step={1}
                            style={{ display: 'block', width: '100%' }}
                          />
                        }
                      />
                    </Col>
                    <Col {...addColSetting}>
                      <FormItem
                        title='???(cm)'
                        content={
                          <InputNumber
                            onChange={this.onAdditionNumberChange.bind(this, 'width')}
                            value={this.state.additionData.width}
                            min={0}
                            max={999999}
                            step={1}
                            style={{ display: 'block', width: '100%' }}
                          />
                        }
                      />
                    </Col>
                    <Col {...addColSetting}>
                      <FormItem
                        title='???(cm)'
                        content={
                          <InputNumber
                            onChange={this.onAdditionNumberChange.bind(this, 'height')}
                            value={this.state.additionData.height}
                            min={0}
                            max={999999}
                            step={1}
                            style={{ display: 'block', width: '100%' }}
                          />
                        }
                      />
                    </Col>
                    <Col {...addColSetting}>
                      <FormItem
                        title='??????(g)'
                        content={
                          <InputNumber
                            onChange={this.onAdditionNumberChange.bind(this, 'weight')}
                            value={this.state.additionData.weight}
                            min={0}
                            max={999999}
                            step={1}
                            style={{ display: 'block', width: '100%' }}
                          />
                        }
                      />
                    </Col>
                    <Col span={24}>
                      <p className='product-real-pictitle'>????????????</p>
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic1Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic1Url} alt='??????1' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic1Url')}>
                              <PhotoViewIcon />
                            </Button>
                          </div>
                          <Upload
                            className='product-real-pic-reupload'
                            accept='image/*'
                            showUploadList={false}
                            beforeUpload={this.onPicUpload.bind(this, 'PIC1')}
                          >
                            <Button size='small'>
                              <PhotoUploadIcon />
                            </Button>
                          </Upload>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          accept='image/*'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC1')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>????????????</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic2Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic2Url} alt='??????2' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic2Url')}>
                              <PhotoViewIcon />
                            </Button>
                          </div>
                          <Upload
                            className='product-real-pic-reupload'
                            accept='image/*'
                            showUploadList={false}
                            beforeUpload={this.onPicUpload.bind(this, 'PIC2')}
                          >
                            <Button size='small'>
                              <PhotoUploadIcon />
                            </Button>
                          </Upload>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          accept='image/*'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC2')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>????????????</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic3Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic3Url} alt='??????3' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic3Url')}>
                              <PhotoViewIcon />
                            </Button>
                          </div>
                          <Upload
                            className='product-real-pic-reupload'
                            accept='image/*'
                            showUploadList={false}
                            beforeUpload={this.onPicUpload.bind(this, 'PIC3')}
                          >
                            <Button size='small'>
                              <PhotoUploadIcon />
                            </Button>
                          </Upload>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          accept='image/*'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC3')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>????????????</span>
                          </Button>
                        </Upload>
                      )}
                    </Col>
                    <Col {...picColSetting}>
                      {this.state.additionData.pic4Url ? (
                        <div className='product-real-pic'>
                          <img src={this.state.additionData.pic4Url} alt='??????4' />
                          <div className='product-real-pic-option'>
                            <Button onClick={this.openPic.bind(this, 'pic4Url')}>
                              <PhotoViewIcon />
                            </Button>
                          </div>
                          <Upload
                            className='product-real-pic-reupload'
                            accept='image/*'
                            showUploadList={false}
                            beforeUpload={this.onPicUpload.bind(this, 'PIC4')}
                          >
                            <Button size='small'>
                              <PhotoUploadIcon />
                            </Button>
                          </Upload>
                        </div>
                      ) : (
                        <Upload
                          className='product-real-upload-wrapper'
                          accept='image/*'
                          showUploadList={false}
                          beforeUpload={this.onPicUpload.bind(this, 'PIC4')}
                        >
                          <Button className='product-real-upload-btn'>
                            <ListAddIcon />
                            <span>????????????</span>
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
                    <img src={this.state.picUrl} alt='????????????' />
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
                        onClick={this.handleCreate.bind(this, true)}
                      >
                        ??????
                      </Button>
                      <Button
                        type='primary'
                        icon={<CheckOutlined />}
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
            </>
          )}
        </Spin>
      </>
    )
  }
}
