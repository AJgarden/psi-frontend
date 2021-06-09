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
  Switch,
  Popover,
  Tooltip,
  Tabs,
  Table,
  Space,
  Button,
  Modal,
  message,
  InputNumber
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons'
import { ListDeleteIcon, ListSearchIcon, ProductExpandIcon } from '../icon/Icon'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import moment from 'moment'
import SelectProductModal from '../utils/SelectProductModal'
import ViewProductModal from '../utils/ViewProductModal'
import { initData } from './saleType'
import SaleAPI from '../../model/api/sale'

export default class SaleForm extends React.Component {
  history = createHashHistory()
  saleAPI = new SaleAPI()

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
      customerList: [],
      colorList: [],
      viewProduct: false,
      viewSeqNo: null
    }
    this.getInitData().then(() => {
      if (!props.createFlag) {
        this.getSaleData().then(() => this.setState({ loading: false }))
      } else {
        this.setState({ loading: false })
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.createFlag && this.props.createFlag) ||
      (!prevProps.drawModeVisible && this.props.drawModeVisible) ||
      (!this.props.createFlag && prevProps.salesId !== this.props.salesId)
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
          viewProduct: false,
          viewSeqNo: null
        },
        () =>
          this.getInitData().then(() => {
            if (!this.props.createFlag) {
              this.getSaleData().then(() => this.setState({ loading: false }))
            } else {
              this.setState({ loading: false })
            }
          })
      )
    }
  }

  getInitData = async () => {
    await new Promise((resolve) => {
      this.saleAPI.getCustomerList().then((response) => {
        this.setState({ customerList: response.data.list }, () => resolve(true))
      })
    })
    await new Promise((resolve) => {
      this.saleAPI.getColorsList().then((response) => {
        this.setState({ colorList: response.data.list }, () => resolve(true))
      })
    })
  }

  getSaleData = () => {
    return new Promise((resolve, reject) => {
      this.saleAPI
        .getSaleData(this.props.salesId)
        .then((response) => {
          if (response.code === 0) {
            const mappingSearch = {}
            response.data.salesDetails.forEach((record) => {
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
                historyData: {}
              }
            })
            this.setState(
              {
                loading: false,
                formData: {
                  ...response.data.salesMaster,
                  confirm: response.data.salesMaster.confirm || false,
                  pay: response.data.salesMaster.pay || false,
                  accountDate: moment(response.data.salesMaster.accountDate, 'YYYY-MM-DD')
                    .startOf('day')
                    .valueOf(),
                  salesDetails: response.data.salesDetails
                },
                mappingSearch
              },
              () => {
                resolve(true)
                // this.getProductInventory().then((salesDetails) => {
                //   const { formData } = this.state
                //   formData.salesDetails = salesDetails
                //   this.setState({ formData }, () => resolve(true))
                // })
              }
            )
          } else {
            reject(false)
            message.error(response.message)
            if (this.props.isDrawMode) {
              this.props.onClose()
            } else {
              this.history.push('/Sale/List')
            }
          }
        })
        .catch(() => {
          reject(false)
          message.error('Error!')
          if (this.props.isDrawMode) {
            this.props.onClose()
          } else {
            this.history.push('/Sale/List')
          }
        })
    })
  }
  getProductInventory = async () => {
    const {
      formData: { salesDetails }
    } = this.state
    for (const item of salesDetails) {
      await new Promise((resolve) => {
        this.saleAPI.getProductInventory(item.productSeqNo).then((response) => {
          if (response.code === 0) {
            item.inventory = response.data
          } else {
            item.inventory = '-'
          }
          resolve(true)
        })
      })
    }
    return Promise.resolve(salesDetails)
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
  onSwitchChange = (type, checked) => {
    console.log(checked)
    const { formData } = this.state
    formData[type] = checked
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
  getCustomerOptions = () => {
    const { formData, search, customerList } = this.state
    return customerList
      .filter(
        (customer) =>
          formData.customerId === customer.customerId ||
          (search.customerId &&
            customer.customerId.toLowerCase().includes(search.customerId.toLowerCase()))
      )
      .map((customer) => {
        return {
          label: `${customer.customerId} - ${customer.name}`,
          value: customer.customerId
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
        width: 60,
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
              <div
                className={`purchase-price-input ${
                  line.value === '' || row.productType === 'OTHERS' ? 'full' : ''
                }`}
              >
                <Button
                  onClick={_this.onSwitchProductModal.bind(_this, row.detailNo)}
                  type={line.value === '' ? 'primary' : 'default'}
                  style={{ width: '100%' }}
                >
                  {line.value === '' ? '選取商品' : line.isVirtual ? `*${line.value}` : line.value}
                </Button>
              </div>
              {line.value !== '' && row.productType !== 'OTHERS' && (
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
                type='sale'
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
        dataIndex: 'quantity',
        title: '數量',
        width: 100,
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <InputNumber
                value={data}
                min={1}
                max={999999}
                step={1}
                onChange={_this.onDetailNumberChange.bind(_this, row.detailNo, 'quantity')}
                style={{ width: '100%' }}
              />
            )
          )
        }
      },
      // {
      //   dataIndex: 'inventory',
      //   title: '庫存',
      //   width: 80
      // },
      {
        dataIndex: 'price',
        title: '售價',
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
                  {row.productSeqNo && _this.state.formData.customerId ? (
                    <Popover
                      title='商品歷史價格'
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
        width: 140,
        render: (data, row) => {
          return row.productSeqNo && `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        dataIndex: 'color',
        title: '顏色',
        width: 140,
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
      },
      {
        dataIndex: 'vendorProductId',
        title: '原廠料號',
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <Input
                value={data}
                onChange={_this.onDetailInputChange.bind(_this, row.detailNo, 'vendorProductId')}
              />
            )
          )
        }
      }
    ]
  }

  renderProductDetail = (record) => {
    return (
      <Row gutter={0}>
        <Col span={8}>
          <div className='product-detail-table-expand-group'>
            <div className='product-detail-table-expand-group-title'>商品名稱</div>
            <div className='product-detail-table-expand-group-content'>{record.productName}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className='product-detail-table-expand-group'>
            <div className='product-detail-table-expand-group-title'>車種簡稱</div>
            <div className='product-detail-table-expand-group-content'>{record.kindShortName}</div>
          </div>
        </Col>
        <Col span={8}>
          <div className='product-detail-table-expand-group'>
            <div className='product-detail-table-expand-group-title'>規格</div>
            <div className='product-detail-table-expand-group-content'>{record.norm}</div>
          </div>
        </Col>
        <Col span={24}>
          <div className='product-detail-table-expand-group'>
            <div className='product-detail-table-expand-group-title'>備註</div>
            <div className='product-detail-table-expand-group-content'>
              <Input.TextArea
                value={record.remark}
                autoSize={{ minRows: 1, maxRows: 4 }}
                onChange={this.onDetailInputChange.bind(this, record.detailNo, 'remark')}
              />
            </div>
          </div>
        </Col>
      </Row>
    )
  }

  onSwitchProductModal = (detailNo) => {
    const { mappingSearch } = this.state
    mappingSearch[detailNo].visible = !mappingSearch[detailNo].visible
    this.setState({ mappingSearch })
  }

  getDetailTotal = () => {
    const {
      formData: { salesDetails }
    } = this.state
    return salesDetails
      .reduce((a, b) => a + b.amount, 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  onDetailInputChange = (detailNo, key, event) => {
    const { formData } = this.state
    const record = formData.salesDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = event.target.value
      this.setState({ formData })
    }
  }
  onDetailSelectChange = (detailNo, key, value) => {
    const { formData } = this.state
    const record = formData.salesDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = value
      this.setState({ formData })
    }
  }
  onDetailNumberChange = (detailNo, key, value) => {
    const { formData } = this.state
    const record = formData.salesDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = value
      record.amount = record.quantity * record.price
      this.setState({ formData })
    }
  }

  onProductAdd = () => {
    const { formData, mappingSearch } = this.state
    const detailNo = formData.salesDetails.length + 1
    formData.salesDetails.push({
      detailNo,
      productId: '',
      productSeqNo: null,
      productName: '',
      kindShortName: '',
      norm: '',
      quantity: 1,
      inventory: 0,
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
      historyData: {}
    }
    this.setState({ formData, mappingSearch })
  }
  onProductDelete = (detailNo) => {
    const { formData, mappingSearch } = this.state
    const index = formData.salesDetails.findIndex((record) => record.detailNo === detailNo)
    formData.salesDetails.splice(index, 1)
    delete mappingSearch[detailNo]
    this.setState({ formData, mappingSearch })
  }

  onVisibleChange = (detailNo, visible) => {
    const { formData, mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    if (visible && row.seqNo && row.historyLoading) {
      this.saleAPI
        .getProductHistoryPrice(row.seqNo, formData.customerId)
        .then((response) => {
          mappingSearch[detailNo].historyLoading = false
          mappingSearch[detailNo].historyData = {
            ...response.data,
            historyPurchasePrices: response.data.historyPurchasePrices.map((record, index) => {
              return {
                ...record,
                index
              }
            }),
            historySalesPrices: response.data.historySalesPrices.map((record, index) => {
              return {
                ...record,
                index
              }
            })
          }
          this.setState({ mappingSearch })
        })
        .catch(() => {
          mappingSearch[detailNo].historyLoading = false
          mappingSearch[detailNo].historyData = {}
          this.setState({ mappingSearch })
        })
    }
  }
  displayHistoryPrice = (detailNo) => {
    const { mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    return (
      <Spin spinning={row.historyLoading}>
        <div style={{ minHeight: 200 }}>
          {Object.keys(row.historyData).length > 0 && (
            <>
              <Tabs defaultActiveKey='purchase'>
                <Tabs.TabPane key='purchase' tab='歷史進價'>
                  <div style={{ height: 271 }}>
                    <Table
                      className='purchase-history-list'
                      rowKey='index'
                      size='small'
                      columns={this.getHistoryPurchaseColumns()}
                      dataSource={row.historyData.historyPurchasePrices}
                      scroll={{ y: 240 }}
                      pagination={false}
                    />
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane key='sale' tab='歷史售價'>
                  <div style={{ height: 271 }}>
                    <Table
                      className='purchase-history-list'
                      rowKey='index'
                      size='small'
                      columns={this.getHistorySaleColumns()}
                      dataSource={row.historyData.historySalesPrices}
                      scroll={{ y: 240 }}
                      pagination={false}
                    />
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </>
          )}
        </div>
      </Spin>
    )
  }
  getHistoryPurchaseColumns = () => [
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
  getHistorySaleColumns = () => [
    {
      dataIndex: 'accountDate',
      title: '日期',
      width: 100
    },
    {
      dataIndex: 'salesId',
      title: '銷售單號',
      width: 180
    },
    {
      dataIndex: 'price',
      title: '售價',
      width: 100,
      render: (data) => {
        return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
    const row = formData.salesDetails.find((row) => row.detailNo === detailNo)
    mappingSearch[detailNo].value = product.data
    mappingSearch[detailNo].seqNo = product.productSeqNo
    mappingSearch[detailNo].isVirtual = product.productType === 'VIRTUAL'
    mappingSearch[detailNo].visible = false
    mappingSearch[detailNo].select = product
    this.setState({ mappingSearch, detailLoading: true }, () => {
      // this.saleAPI.getProductInventory(product.productSeqNo).then((response) => {
      // row.inventory = response.data
      this.saleAPI.getProductData(product.productSeqNo, formData.customerId).then((response) => {
        row.productId = product.data
        row.productSeqNo = product.productSeqNo
        row.productName = response.data.name
        row.kindShortName = response.data.kindShortName
        row.norm = response.data.norm
        row.quantity = 1
        row.price = response.data.price
        row.amount = response.data.price
        row.color = ''
        row.unit = response.data.unit
        row.vendorProductId = response.data.vendorProductId
        this.setState({ formData, detailLoading: false })
      })
      // })
    })
  }

  // 新增
  handleCreate = (back) => {
    this.setState({ loading: true }, () => {
      const { formData } = this.state
      formData.accountDate = moment(formData.accountDate).format('YYYY-MM-DD')
      formData.salesDetails = formData.salesDetails.filter((record) => record.productSeqNo !== null)
      this.saveSaleData(true, formData)
        .then(() => {
          message.success('成功新增資料')
          if (back) {
            if (this.props.isDrawMode) {
              this.props.onClose()
            } else {
              this.history.push('/Sale/List')
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
        })
        .catch(() => {
          this.setState({ loading: false })
        })
    })
  }
  // 修改
  handleSubmit = (back) => {
    this.setState({ loading: true }, () => {
      const { formData } = this.state
      formData.accountDate = moment(formData.accountDate).format('YYYY-MM-DD')
      formData.salesDetails = formData.salesDetails.filter((record) => record.productSeqNo !== null)
      this.saveSaleData(false, formData)
        .then(() => {
          message.success('成功更新資料')
          if (back) {
            if (this.props.isDrawMode) {
              this.props.onClose()
            } else {
              this.history.push('/Sale/List')
            }
          } else {
            const drawerContent = document.querySelector('.ant-drawer-body')
            const layoutContent = document.getElementById('layout-content-wrapper')
            if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' })
            if (layoutContent) layoutContent.scrollTo({ top: 0, behavior: 'smooth' })
            this.getSaleData()
          }
        })
        .catch(() => {
          this.setState({ loading: false })
        })
    })
  }
  saveSaleData = async (isAdd, formData) => {
    let salesId = ''
    if (isAdd) {
      salesId = await new Promise((resolve, reject) => {
        this.saleAPI
          .addSaleData(formData)
          .then((response) => {
            if (response.code === 0) {
              resolve(response.data.salesMaster.salesId)
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
              reject(false)
            }
          })
          .catch((error) => {
            message.error(error.data.message)
            reject(false)
          })
      })
    } else {
      salesId = await new Promise((resolve, reject) => {
        this.saleAPI
          .updateSaleData(formData)
          .then((response) => {
            if (response.code === 0) {
              resolve(response.data.salesMaster.salesId)
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
              reject(false)
            }
          })
          .catch((response) => {
            message.error(response.data.message)
            reject(false)
          })
      })
    }
    await new Promise((resolve, reject) => {
      this.saleAPI
        .saveSaleConfirmFlag(salesId, formData.confirm)
        .then(() => resolve(true))
        .catch((response) => {
          message.error(response.data.message)
          reject(false)
        })
    })
    await new Promise((resolve, reject) => {
      this.saleAPI
        .saveSalePayFlag(salesId, formData.pay)
        .then(() => resolve(true))
        .catch((response) => {
          message.error(response.data.message)
          reject(false)
        })
    })
  }

  openPrint = () => {
    const url = `${window.location.href.split('#')[0]}#/Sale/Print/${this.props.salesId}`
    window.open(url)
  }

  handleCancel = () => {
    if (this.props.isDrawMode) {
      this.props.onClose()
    } else {
      this.history.push('/Sale/List')
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
              <Link to='/Sale/List'>銷貨單</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.props.createFlag ? '新增銷貨單' : '修改銷貨單資料'}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        <Spin spinning={this.state.loading}>
          <Card className='form-detail-card'>
            <Row {...rowSetting}>
              <Col {...colSetting1}>
                <FormItem
                  title='銷貨日期'
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
                  title='客戶'
                  content={
                    <Select
                      placeholder='搜尋客戶代號'
                      value={this.state.formData.customerId}
                      searchValue={this.state.search.customerId}
                      showSearch={true}
                      showArrow={false}
                      options={this.getCustomerOptions()}
                      onSearch={this.onCodeSearch.bind(this, 'customerId')}
                      onSelect={this.onCodeSelect.bind(this, 'customerId')}
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
                      autoSize={{ minRows: 1, maxRows: 4 }}
                    />
                  }
                />
              </Col>
              <Col span={12}>
                <FormItem
                  title='已收款'
                  content={
                    <Switch
                      checked={this.state.formData.pay}
                      onChange={this.onSwitchChange.bind(this, 'pay')}
                    />
                  }
                />
              </Col>
              <Col span={12}>
                <FormItem
                  title='已回單'
                  content={
                    <Switch
                      checked={this.state.formData.confirm}
                      onChange={this.onSwitchChange.bind(this, 'confirm')}
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
              dataSource={JSON.parse(JSON.stringify(this.state.formData.salesDetails))}
              expandable={{
                columnWidth: 36,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.productSeqNo && (
                    <Space className='list-table-option'>
                      <Button size='small' onClick={() => onExpand(record)}>
                        <ProductExpandIcon
                          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </Button>
                    </Space>
                  ),
                expandedRowRender: this.renderProductDetail,
                rowExpandable: (record) => record.productSeqNo
              }}
              footer={() => (
                <div className='purchase-detail-table-footer'>
                  <div>
                    <Button
                      onClick={this.onProductAdd}
                      disabled={this.state.formData.customerId === ''}
                    >
                      新增商品
                    </Button>
                  </div>
                  <div>
                    <span className='purchase-product-total-amount'>
                      總金額： <span>$ {this.getDetailTotal()}</span>
                    </span>
                  </div>
                </div>
              )}
              scroll={{ x: 980 }}
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
                    disabled={this.state.formData.customerId === ''}
                    onClick={this.handleCreate.bind(this, true)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={this.state.formData.customerId === ''}
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
                  <Button
                    className='form-option-print'
                    icon={<PrinterOutlined />}
                    onClick={this.openPrint}
                  >
                    列印
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
