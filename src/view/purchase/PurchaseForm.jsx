import React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  Spin,
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Popover,
  Tooltip,
  Table,
  Space,
  Button,
  Modal,
  message,
  InputNumber
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ListDeleteIcon, ListSearchIcon, ProductExpandIcon } from '../icon/Icon'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import moment from 'moment'
import SelectProductModal from '../utils/SelectProductModal'
import ViewProductModal from '../utils/ViewProductModal'
import { initData } from './purchaseType'
import PurchaseAPI from '../../model/api/purchase'

export default class PurchaseForm extends React.Component {
  history = createHashHistory()
  purchaseAPI = new PurchaseAPI()

  constructor(props) {
    super(props)
    const formData = JSON.parse(JSON.stringify(initData))
    formData.accountDate = moment().startOf('day').valueOf()
    this.state = {
      loading: true,
      formData,
      search: {
        vendorId: ''
      },
      detailLoading: false,
      mappingSearch: {},
      vendorList: [],
      colorList: [],
      viewProduct: false,
      viewSeqNo: null
    }
    this.getInitData().then(() => {
      if (!props.createFlag) {
        this.getPurchaseData().then(() => this.setState({ loading: false }))
      } else {
        this.setState({ loading: false })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.createFlag && this.props.createFlag) ||
      (!prevProps.drawModeVisible && this.props.drawModeVisible) ||
      (!this.props.createFlag && prevProps.purchaseId !== this.props.purchaseId)
    ) {
      const formData = JSON.parse(JSON.stringify(initData))
      formData.accountDate = moment().startOf('day').valueOf()
      this.setState(
        {
          loading: true,
          formData,
          search: {
            vendorId: ''
          },
          detailLoading: false,
          mappingSearch: {},
          canSubmit: false,
          viewProduct: false,
          viewSeqNo: null
        },
        () =>
          this.getInitData().then(() => {
            if (!this.props.createFlag) {
              this.getPurchaseData().then(() => this.setState({ loading: false }))
            } else {
              this.setState({ loading: false })
            }
          })
      )
    }
  }

  getInitData = async () => {
    await new Promise((resolve) => {
      this.purchaseAPI.getVendorsList().then((response) => {
        this.setState({ vendorList: response.data.list }, () => resolve(true))
      })
    })
    await new Promise((resolve) => {
      this.purchaseAPI.getColorsList().then((response) => {
        this.setState({ colorList: response.data.list }, () => resolve(true))
      })
    })
  }

  getPurchaseData = () => {
    return new Promise((resolve, reject) => {
      this.purchaseAPI
        .getPurchaseData(this.props.purchaseId)
        .then((response) => {
          if (response.code === 0) {
            const mappingSearch = {}
            response.data.purchaseDetails.forEach((record) => {
              mappingSearch[record.detailNo] = {
                loading: false,
                value: record.productId,
                seqNo: record.productSeqNo,
                isVirtual: record.productType === 'VIRTUAL',
                search: '',
                searchTime: 0,
                list: [],
                select: {},
                historyLoading: true,
                historyList: []
              }
            })
            this.setState(
              {
                loading: false,
                formData: {
                  ...response.data.purchaseMaster,
                  accountDate: moment(
                    response.data.purchaseMaster.accountDate,
                    'YYYY-MM-DD'
                  ).startOf('day'),
                  purchaseDetails: response.data.purchaseDetails
                },
                mappingSearch
              },
              () => {
                resolve(true)
              }
            )
          } else {
            reject(false)
            message.error(response.message)
            if (this.props.isDrawMode) {
              this.props.onClose()
            } else {
              this.history.push('/Purchase/List')
            }
          }
        })
        .catch(() => {
          reject(false)
          message.error('Error!')
          if (this.props.isDrawMode) {
            this.props.onClose()
          } else {
            this.history.push('/Purchase/List')
          }
        })
    })
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
  onDateChange = (type, date) => {
    const { formData } = this.state
    formData[type] = date
    this.setState({ formData })
  }

  // code select
  onCodeSearch = (key, value) => {
    if (!value.includes(' ')) {
      const { search } = this.state
      search[key] = value.toUpperCase()
      this.setState({ search })
    }
  }
  onCodeSelect = (key, value) => {
    const { formData, search, vendorList } = this.state
    search[key] = ''
    formData[key] = value
    if (key === 'vendorId') {
      const vendor = vendorList.find(
        (vendor) => vendor.vendorId.toLowerCase() === value.toLowerCase()
      )
      if (vendor) formData.vendorName = vendor.name
    }
    this.setState({ search, formData })
  }
  // get code options
  getVendorOptions = () => {
    const { formData, search, vendorList } = this.state
    return vendorList
      .filter(
        (vendor) =>
          formData.vendorId === vendor.vendorId ||
          (search.vendorId && vendor.vendorId.toLowerCase().includes(search.vendorId.toLowerCase()))
      )
      .map((vendor) => {
        return {
          label: `${vendor.vendorId} - ${vendor.name}`,
          value: vendor.vendorId
        }
      })
  }

  // purchase detail
  getDetailColumns = () => {
    const _this = this
    return [
      {
        dataIndex: 'detailNo',
        title: '刪除',
        width: 50,
        fixed: 'left',
        render: (data) => (
          <Space className='list-table-option'>
            <Button
              className='list-table-option-delete'
              size='small'
              onClick={_this.onProductDelete.bind(_this, data)}
            >
              <ListDeleteIcon />
            </Button>
          </Space>
        )
      },
      {
        dataIndex: 'productId',
        title: '商品代號',
        width: 200,
        fixed: 'left',
        render: (data, row) => {
          const { mappingSearch } = this.state
          const line = mappingSearch[row.detailNo]
          return (
            <div className='purchase-price-row'>
              <div className={`purchase-price-input ${line.value === '' ? 'full' : ''}`}>
                <Button
                  onClick={_this.onSwitchProductModal.bind(_this, row.detailNo)}
                  type={line.value === '' ? 'primary' : 'default'}
                  style={{ width: '100%' }}
                >
                  {line.value === '' ? '選取商品' : line.isVirtual ? `*${line.value}` : line.value}
                </Button>
              </div>
              {line.value !== '' && (
                <div className='purchase-price-view'>
                  <Tooltip title='商品資訊'>
                    <Button
                      onClick={() => this.setState({ viewProduct: true, viewSeqNo: line.seqNo })}
                    >
                      <ListSearchIcon />
                    </Button>
                  </Tooltip>
                </div>
              )}
              <SelectProductModal
                type='purchase'
                detailNo={row.detailNo}
                visible={line.visible}
                value={line.value}
                onSelect={_this.onMappingSelect}
                onClose={_this.onSwitchProductModal.bind(_this, row.detailNo)}
              />
            </div>
          )
        }
      },
      {
        dataIndex: 'kindShortName',
        title: '車種',
        width: 200
      },
      {
        dataIndex: 'productName',
        title: '名稱',
        width: 200
      },
      {
        dataIndex: 'norm',
        title: '規格',
        width: 80
      },
      {
        dataIndex: 'quantity',
        title: '進貨量',
        width: 80,
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <InputNumber
                value={data}
                min={0}
                max={999999}
                step={1}
                onChange={_this.onDetailNumberChange.bind(_this, row.detailNo, 'quantity')}
                style={{ width: '100%' }}
              />
            )
          )
        }
      },
      {
        dataIndex: 'price',
        title: '進貨價',
        width: 140,
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <div className='purchase-price-row'>
                <div className='purchase-price-input'>
                  <InputNumber
                    value={data}
                    min={0}
                    max={99999999}
                    step={1}
                    onChange={_this.onDetailNumberChange.bind(_this, row.detailNo, 'price')}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className='purchase-price-view'>
                  {row.productSeqNo ? (
                    <Popover
                      title='歷史進價'
                      content={_this.displayHistoryPrice(row.detailNo)}
                      overlayClassName='purchase-history-price'
                      onVisibleChange={_this.onVisibleChange.bind(_this, row.detailNo)}
                    >
                      <Button>
                        <ListSearchIcon />
                      </Button>
                    </Popover>
                  ) : (
                    <Button disabled={true}>
                      <ListSearchIcon />
                    </Button>
                  )}
                </div>
              </div>
            )
          )
        }
      },
      {
        dataIndex: 'amount',
        title: '金額',
        width: 100,
        render: (data, row) => {
          return row.productSeqNo && `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        dataIndex: 'remark',
        title: '備註',
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <Input
                value={data}
                onChange={_this.onDetailInputChange.bind(_this, row.detailNo, 'remark')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'color',
        title: '顏色',
        width: 100,
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <Select
                placeholder='選擇顏色'
                value={data === '' ? null : data}
                showSearch={true}
                showArrow={false}
                allowClear={true}
                onChange={_this.onDetailSelectChange.bind(_this, row.detailNo, 'color')}
                style={{ width: '100%' }}
                notFoundContent={null}
              >
                {_this.state.colorList.map((color) => (
                  <Select.Option key={color.colorId} value={color.name}>
                    {color.name}
                  </Select.Option>
                ))}
              </Select>
            )
          )
        }
      }
      // {
      //   dataIndex: 'vendorProductId',
      //   title: '原廠料號',
      //   width: 200,
      //   render: (data, row) => {
      //     return (
      //       row.productSeqNo && (
      //         <Input
      //           value={data}
      //           onChange={_this.onDetailInputChange.bind(_this, row.detailNo, 'vendorProductId')}
      //         />
      //       )
      //     )
      //   }
      // }
    ]
  }

  // renderProductDetail = (record) => {
  //   return (
  //     <Row gutter={0}>
  //       <Col span={8}>
  //         <div className='product-detail-table-expand-group'>
  //           <div className='product-detail-table-expand-group-title'>商品名稱</div>
  //           <div className='product-detail-table-expand-group-content'>{record.productName}</div>
  //         </div>
  //       </Col>
  //       <Col span={8}>
  //         <div className='product-detail-table-expand-group'>
  //           <div className='product-detail-table-expand-group-title'>車種簡稱</div>
  //           <div className='product-detail-table-expand-group-content'>{record.kindShortName}</div>
  //         </div>
  //       </Col>
  //       <Col span={8}>
  //         <div className='product-detail-table-expand-group'>
  //           <div className='product-detail-table-expand-group-title'>規格</div>
  //           <div className='product-detail-table-expand-group-content'>{record.norm}</div>
  //         </div>
  //       </Col>
  //       <Col span={24}>
  //         <div className='product-detail-table-expand-group'>
  //           <div className='product-detail-table-expand-group-title'>備註</div>
  //           <div className='product-detail-table-expand-group-content'>
  //             <Input.TextArea
  //               value={record.remark}
  //               autoSize={{ minRows: 1, maxRows: 4 }}
  //               onChange={this.onDetailInputChange.bind(this, record.detailNo, 'remark')}
  //             />
  //           </div>
  //         </div>
  //       </Col>
  //     </Row>
  //   )
  // }

  onSwitchProductModal = (detailNo) => {
    const { mappingSearch } = this.state
    mappingSearch[detailNo].visible = !mappingSearch[detailNo].visible
    this.setState({ mappingSearch })
  }

  getDetailTotal = () => {
    const {
      formData: { purchaseDetails }
    } = this.state
    return purchaseDetails
      .reduce((a, b) => a + b.amount, 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  onDetailInputChange = (detailNo, key, event) => {
    const { formData } = this.state
    const record = formData.purchaseDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = event.target.value
      this.setState({ formData })
    }
  }
  onDetailSelectChange = (detailNo, key, value) => {
    const { formData } = this.state
    const record = formData.purchaseDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = value
      this.setState({ formData })
    }
  }
  onDetailNumberChange = (detailNo, key, value) => {
    const { formData } = this.state
    const record = formData.purchaseDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = value
      record.amount = record.quantity * record.price
      this.setState({ formData })
    }
  }

  onProductAdd = () => {
    const { formData, mappingSearch } = this.state
    const detailNo = formData.purchaseDetails.length + 1
    formData.purchaseDetails.push({
      detailNo,
      productId: '',
      productSeqNo: null,
      productName: '',
      kindShortName: '',
      norm: '',
      quantity: 1,
      price: 0,
      amount: 0,
      remark: '',
      color: '',
      vendorProductId: ''
    })
    mappingSearch[detailNo] = {
      loading: false,
      value: '',
      seqNo: null,
      isVirtual: false,
      visible: false,
      select: {},
      historyLoading: true,
      historyList: []
    }
    this.setState({ formData, mappingSearch })
  }
  onProductDelete = (detailNo) => {
    const { formData, mappingSearch } = this.state
    const index = formData.purchaseDetails.findIndex((record) => record.detailNo === detailNo)
    formData.purchaseDetails.splice(index, 1)
    delete mappingSearch[detailNo]
    this.setState({ formData, mappingSearch })
  }

  onVisibleChange = (detailNo, visible) => {
    const { mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    if (visible && row.seqNo && row.historyLoading) {
      this.purchaseAPI
        .getProductHistoryPrice(row.seqNo)
        .then((response) => {
          mappingSearch[detailNo].historyLoading = false
          mappingSearch[detailNo].historyList = response.data.map((price, index) => {
            return {
              ...price,
              index
            }
          })
          this.setState({ mappingSearch })
        })
        .catch(() => {
          mappingSearch[detailNo].historyLoading = false
          this.setState({ mappingSearch })
        })
    }
  }
  displayHistoryPrice = (detailNo) => {
    const { mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    return (
      <Table
        className='purchase-history-list'
        rowKey='index'
        size='small'
        columns={this.getHistoryColumns()}
        dataSource={row.historyList}
        scroll={{ y: 240 }}
        loading={row.historyLoading}
        pagination={false}
      />
    )
  }
  getHistoryColumns = () => [
    {
      dataIndex: 'accountDate',
      title: '日期',
      width: 100
    },
    {
      dataIndex: 'vendorName',
      title: '廠商名稱',
      width: 180
    },
    {
      dataIndex: 'amount',
      title: '進價',
      width: 100,
      render: (data, row) => {
        const price = data / row.quantity
        return `$ ${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  ]

  // mapping product search & select
  getMappingProductDisplay = (product) => {
    let display = product.desc1
    if (product.desc2 || product.desc3 || product.desc4 || product.desc5) {
      let additionDisplay = ''
      additionDisplay += product.desc2 ? product.desc2 : ''
      additionDisplay += product.desc3
        ? additionDisplay !== ''
          ? `, ${product.desc3}`
          : product.desc3
        : ''
      additionDisplay += product.desc4
        ? additionDisplay !== ''
          ? `, ${product.desc4}`
          : product.desc4
        : ''
      additionDisplay += product.desc5
        ? additionDisplay !== ''
          ? `, ${product.desc5}`
          : product.desc5
        : ''
      display += ` [${additionDisplay}]`
    }
    return display
  }
  onMappingSelect = (detailNo, product) => {
    const { formData, mappingSearch } = this.state
    const row = formData.purchaseDetails.find((row) => row.detailNo === detailNo)
    mappingSearch[detailNo].value = product.data
    mappingSearch[detailNo].seqNo = product.productSeqNo
    mappingSearch[detailNo].isVirtual = product.productType === 'VIRTUAL'
    mappingSearch[detailNo].visible = false
    mappingSearch[detailNo].select = product
    this.setState({ mappingSearch, detailLoading: true }, () => {
      this.purchaseAPI.getProductData(product.productSeqNo).then((response) => {
        row.productId = product.data
        row.productSeqNo = product.productSeqNo
        row.productName = response.data.name
        row.kindShortName = response.data.kindShortName
        row.norm = response.data.norm
        row.quantity = 1
        row.price = 0
        row.amount = 0
        row.color = ''
        row.unit = response.data.unit
        row.vendorProductId = response.data.vendorProductId
        this.setState({ formData, detailLoading: false })
      })
    })
  }

  // 新增
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      const { formData } = this.state
      formData.accountDate = moment(formData.accountDate).format('YYYY-MM-DD')
      formData.purchaseDetails = formData.purchaseDetails.filter(
        (record) => record.productSeqNo !== null
      )
      this.purchaseAPI
        .addPurchaseData(formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功新增資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Purchase/List')
              }
            } else {
              const drawerContent = document.querySelector('.ant-drawer-body')
              const layoutContent = document.getElementById('layout-content-wrapper')
              if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' })
              if (layoutContent) layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              const formData = JSON.parse(JSON.stringify(initData))
              formData.accountDate = moment().startOf('day')
              this.setState({
                loading: false,
                formData,
                search: {
                  vendorId: ''
                }
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
      const { formData } = this.state
      formData.accountDate = moment(formData.accountDate).format('YYYY-MM-DD')
      formData.purchaseDetails = formData.purchaseDetails.filter(
        (record) => record.productSeqNo !== null
      )
      this.purchaseAPI
        .updatePurchaseData(formData)
        .then((response) => {
          if (response.code === 0) {
            message.success('成功更新資料')
            if (back) {
              if (this.props.isDrawMode) {
                this.props.onClose()
              } else {
                this.history.push('/Purchase/List')
              }
            } else {
              const drawerContent = document.querySelector('.ant-drawer-body')
              const layoutContent = document.getElementById('layout-content-wrapper')
              if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' })
              if (layoutContent) layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
              this.getPurchaseData()
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
      this.history.push('/Purchase/List')
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
          lg: 16
        }
    return (
      <>
        {!this.props.isDrawMode && (
          <Breadcrumb style={{ marginBottom: 10 }}>
            <Breadcrumb.Item>
              <Link to='/Purchase/List'>進貨單</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.props.createFlag ? '新增進貨單' : '修改進貨單資料'}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting1}>
                <FormItem
                  title='進貨日期'
                  content={
                    <DatePicker
                      value={moment(this.state.formData.accountDate)}
                      allowClear={false}
                      disabled={!this.props.createFlag}
                      onChange={this.onDateChange.bind(this, 'accountDate')}
                      style={{ width: '100%' }}
                    />
                  }
                />
              </Col>
              <Col {...colSetting2}>
                <FormItem
                  title='廠商'
                  content={
                    <Select
                      placeholder='搜尋廠商代號'
                      value={this.state.formData.vendorId}
                      searchValue={this.state.search.vendorId}
                      showSearch={true}
                      showArrow={false}
                      options={this.getVendorOptions()}
                      onSearch={this.onCodeSearch.bind(this, 'vendorId')}
                      onSelect={this.onCodeSelect.bind(this, 'vendorId')}
                      style={{ width: '100%' }}
                      notFoundContent={null}
                      disabled={!this.props.createFlag}
                    />
                  }
                />
              </Col>
              <Col span={24}>
                <FormItem
                  title='備註'
                  align='flex-start'
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
          <Card className='form-detail-card purchase-detail-card'>
            <Table
              className='purchase-detail-table'
              rowKey='detailNo'
              size='small'
              columns={this.getDetailColumns()}
              dataSource={JSON.parse(JSON.stringify(this.state.formData.purchaseDetails))}
              // expandable={{
              //   columnWidth: 36,
              //   expandIcon: ({ expanded, onExpand, record }) =>
              //     record.productSeqNo && (
              //       <Space className='list-table-option'>
              //         <Button size='small' onClick={() => onExpand(record)}>
              //           <ProductExpandIcon
              //             style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              //           />
              //         </Button>
              //       </Space>
              //     ),
              //   expandedRowRender: this.renderProductDetail,
              //   rowExpandable: (record) => record.productSeqNo
              // }}
              footer={() => (
                <div className='purchase-detail-table-footer'>
                  <div>
                    <Button onClick={this.onProductAdd}>新增商品</Button>
                  </div>
                  <div>
                    <span className='purchase-product-total-amount'>
                      總金額： <span>$ {this.getDetailTotal()}</span>
                    </span>
                  </div>
                </div>
              )}
              scroll={{ x: 1250 }}
              loading={this.state.detailLoading}
              pagination={false}
            />
            <ViewProductModal
              visible={this.state.viewProduct}
              seqNo={this.state.viewSeqNo}
              onClose={() => this.setState({ viewProduct: false, viewSeqNo: null })}
            />
          </Card>
          <div style={{ margin: '20px', textAlign: 'center' }}>
            <Space>
              {this.props.createFlag ? (
                <>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={this.handleCreate.bind(this, true)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
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
