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
  InputNumber,
  AutoComplete,
  Empty
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined
} from '@ant-design/icons'
import { ListDeleteIcon, ListSearchIcon, SaleDeliveryIcon } from '../icon/Icon'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import moment from 'moment'
import SelectProductHover from '../utils/SelectProductHover'
import ViewProductModal from '../utils/ViewProductModal'
import { initData } from './saleType'
import SaleAPI from '../../model/api/sale'

export default class SaleForm extends React.Component {
  history = createHashHistory()
  saleAPI = new SaleAPI()
  remarkRef = null
  refList = {}
  onProductSelectClick = false

  constructor(props) {
    super(props)
    const formData = JSON.parse(JSON.stringify(initData))
    formData.accountDate = moment().startOf('day').valueOf()
    this.state = {
      loading: true,
      formData,
      deliveryLog: null,
      deliveryVisible: false,
      deliveryPic: null,
      deliveryPicVisible: false,
      search: {
        customerId: ''
      },
      detailLoading: false,
      mappingSearch: {},
      customerList: [],
      remarkList: [],
      colorList: [],
      viewProduct: false,
      viewSeqNo: null,
      priceTabKey: 'purchase'
    }
    this.getInitData().then(() => {
      if (!props.createFlag) {
        this.getSaleData().then(() => this.setState({ loading: false }))
      } else {
        this.setState({ loading: false })
      }
    })
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown)
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown)
  }
  onMouseDown = (event) => {
    if (event.target.closest('.product-select-hover') !== null) {
      this.onProductSelectClick = true
    } else {
      this.onProductSelectClick = false
    }
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
          deliveryLog: null,
          deliveryVisible: false,
          deliveryPic: null,
          deliveryPicVisible: false,
          search: {
            customerId: ''
          },
          detailLoading: false,
          mappingSearch: {},
          viewProduct: false,
          viewSeqNo: null,
          priceTabKey: 'purchase'
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
    await new Promise((resolve) => {
      this.saleAPI.getRemarkList().then((response) => {
        this.setState(
          { remarkList: response.data.filter((value) => value !== '').map((value) => ({ value })) },
          () => resolve(true)
        )
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
                search: record.productId,
                value: record.productId,
                seqNo: record.productSeqNo,
                isVirtual: record.productType === 'VIRTUAL',
                select: {},
                selectVisible: false,
                selectFinished: false,
                historyVisible: false,
                historySeqNo: null,
                historyLoading: true,
                historyData: {}
              }
              this.refList[record.detailNo] = {
                productId: null,
                qty: null,
                price: null,
                remark: null,
                color: null
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
                deliveryLog:
                  response.data.salesDeliveryLog.timeStamp === null
                    ? null
                    : response.data.salesDeliveryLog,
                deliveryVisible: response.data.salesDeliveryLog.timeStamp !== null,
                mappingSearch
              },
              () => resolve(true)
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
    formData[type] = moment(date).valueOf()
    this.setState({ formData })
  }
  onSwitchChange = (type, checked) => {
    console.log(checked)
    const { formData } = this.state
    formData[type] = checked
    this.setState({ formData })
  }
  onRemarkKeydown = (event) => {
    if (event.keyCode === 13) {
      const key = Object.keys(this.refList)[0]
      this.refList[key].productId.focus()
    }
  }

  // code select
  onCodeSearch = (value) => {
    if (!value.includes(' ')) {
      const { search } = this.state
      search.customerId = value.toUpperCase()
      this.setState({ search })
    }
  }
  onCodeSelect = (value) => {
    const { formData, mappingSearch, search, customerList } = this.state
    if (formData.customerId === '') {
      formData.salesDetails = [
        {
          detailNo: 1,
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
        }
      ]
      mappingSearch[1] = {
        loading: false,
        search: '',
        value: '',
        seqNo: null,
        isVirtual: false,
        select: {},
        selectVisible: false,
        selectFinished: false,
        historyVisible: false,
        historySeqNo: null,
        historyLoading: true,
        historyData: {}
      }
      this.refList[1] = {
        productId: null,
        qty: null,
        price: null,
        remark: null,
        color: null
      }
    }
    search.customerId = ''
    formData.customerId = value
    const customer = customerList.find(
      (customer) => customer.customerId.toLowerCase() === value.toLowerCase()
    )
    if (customer) formData.customerName = customer.name
    this.setState({ search, formData, mappingSearch }, () => this.remarkRef.focus())
  }
  // get code options
  getCustomerOptions = () => {
    const { formData, search, customerList } = this.state
    let list = []
    if (search.customerId === '') {
      if (formData.customerId === '') {
        list = customerList.slice()
      } else {
        list = customerList.filter((customer) => formData.customerId === customer.customerId)
      }
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(search.customerId)) {
      list = customerList.filter(
        (customer) =>
          formData.customerId === customer.customerId || customer.name.includes(search.customerId)
      )
    } else {
      list = customerList.filter(
        (customer) =>
          formData.customerId === customer.customerId ||
          (search.customerId &&
            customer.customerId.toLowerCase().match(`^${search.customerId.toLowerCase()}`, 'i'))
      )
    }
    return list.map((customer) => ({
      label: `${customer.customerId} - ${customer.name}`,
      value: customer.customerId
    }))
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
        render: (detailNo, row, index) => {
          return (
            index > 0 && (
              <Space className='list-table-option'>
                <Button
                  className='list-table-option-delete'
                  size='small'
                  onClick={_this.onProductDelete.bind(_this, detailNo)}
                >
                  <ListDeleteIcon />
                </Button>
              </Space>
            )
          )
        }
      },
      {
        dataIndex: 'productId',
        title: '商品代號',
        width: 200,
        fixed: 'left',
        render: (data, row) => {
          const { mappingSearch } = _this.state
          const line = mappingSearch[row.detailNo]
          return (
            <div className='purchase-price-row'>
              <div
                className={`purchase-price-input ${
                  line.value === '' || row.productType === 'OTHERS' ? 'full' : ''
                }`}
              >
                <Popover
                  title={null}
                  content={
                    <SelectProductHover
                      type='sale'
                      detailNo={row.detailNo}
                      keyword={line.search}
                      onSearchSelect={_this.onSearchSelect}
                    />
                  }
                  placement='rightTop'
                  visible={line.selectVisible}
                  destroyTooltipOnHide={true}
                  overlayClassName={`product-select-hover ${
                    line.search.length > 2 ? 'product' : 'type'
                  }`}
                  getPopupContainer={() => document.getElementById('sale-form-wrapper')}
                >
                  <Input
                    value={line.search}
                    onChange={_this.onSearchProduct.bind(_this, row.detailNo)}
                    onKeyDown={_this.onSearchKeydown.bind(_this, row.detailNo)}
                    onBlur={_this.onSearchBlur.bind(_this, row.detailNo)}
                    ref={(target) => (_this.refList[row.detailNo].productId = target)}
                  />
                </Popover>
              </div>
              {line.value !== '' && row.productType !== 'OTHERS' && (
                <div className='purchase-price-view'>
                  <Tooltip title='商品資訊'>
                    <Button
                      onClick={() => _this.setState({ viewProduct: true, viewSeqNo: line.seqNo })}
                    >
                      <ListSearchIcon />
                    </Button>
                  </Tooltip>
                </div>
              )}
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
        title: '數量',
        width: 80,
        render: (data, row) => {
          return (
            row.productSeqNo && (
              <InputNumber
                value={data}
                min={-999999}
                max={999999}
                step={1}
                onChange={_this.onDetailNumberChange.bind(_this, row.detailNo, 'quantity')}
                style={{ width: '100%' }}
                ref={(target) => (_this.refList[row.detailNo].qty = target)}
                onKeyDown={_this.onDetailNumberKeydown.bind(_this, row.detailNo)}
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
          const { mappingSearch } = _this.state
          const line = mappingSearch[row.detailNo]
          return (
            row.productSeqNo && (
              <Popover
                title='商品歷史價格'
                content={_this.displayHistoryPrice(row.detailNo)}
                visible={line.historyVisible}
                placement='leftTop'
                overlayClassName='purchase-history-price on-price-input'
              >
                <InputNumber
                  value={data}
                  min={0}
                  max={99999999}
                  step={1}
                  onChange={_this.onDetailNumberChange.bind(_this, row.detailNo, 'price')}
                  style={{ width: '100%' }}
                  ref={(target) => (_this.refList[row.detailNo].price = target)}
                  onFocus={_this.onHistoryVisible.bind(_this, row.detailNo, true)}
                  onBlur={_this.onHistoryVisible.bind(_this, row.detailNo, false)}
                  onKeyDown={_this.onPriceEnter.bind(_this, row.detailNo)}
                />
              </Popover>
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
              <AutoComplete
                value={data}
                options={_this.state.remarkList}
                onChange={_this.onDetailSelectChange.bind(_this, row.detailNo, 'remark')}
                onKeyDown={_this.onNoteKeydown.bind(_this, row.detailNo)}
                ref={(target) => (_this.refList[row.detailNo].remark = target)}
                style={{ width: '100%' }}
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
                onKeyDown={_this.onColorKeydown.bind(_this, row.detailNo)}
                style={{ width: '100%' }}
                notFoundContent={null}
                ref={(target) => (_this.refList[row.detailNo].color = target)}
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
      //   width: 160,
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

  onSearchProduct = (detailNo, event) => {
    const { mappingSearch } = this.state
    mappingSearch[detailNo].search = event.target.value
    this.setState({ mappingSearch })
  }
  onSearchKeydown = (detailNo, event) => {
    if (
      event.keyCode === 33 ||
      event.keyCode === 34 ||
      event.keyCode === 38 ||
      event.keyCode === 40
    ) {
      event.preventDefault()
    } else if (event.keyCode === 13) {
      event.preventDefault()
      const { mappingSearch } = this.state
      const line = mappingSearch[detailNo]
      if (line.search !== '') {
        if (!line.selectVisible) {
          line.selectVisible = true
        } else if (line.selectFinished) {
          line.selectVisible = false
        }
        this.setState({ mappingSearch })
      }
    }
  }
  onSearchBlur = (detailNo, event) => {
    event.preventDefault()
    setTimeout(() => {
      const { mappingSearch } = this.state
      const line = mappingSearch[detailNo]
      if (!this.onProductSelectClick) {
        if (line.value === '' || !line.seqNo) {
          line.search = ''
        } else {
          line.search = line.value
        }
        line.selectVisible = false
        this.refList[detailNo].productId.blur()
        this.setState({ mappingSearch })
      } else if (line.value === '' || !line.seqNo) {
        this.refList[detailNo].productId.focus()
      }
    }, 100)
  }
  onSearchSelect = (detailNo, value, isFinished) => {
    const { mappingSearch } = this.state
    const line = mappingSearch[detailNo]
    if (isFinished) {
      line.search = value.split('|')[0]
      line.value = value.split('|')[0]
      line.seqNo = Number(value.split('|')[1])
      line.selectFinished = true
      line.selectVisible = false
      this.setState({ mappingSearch }, () => this.enterProduct(detailNo))
    } else {
      line.search = value
      line.value = ''
      line.seqNo = null
      line.selectFinished = false
      this.setState({ mappingSearch }, () => this.clearProduct(detailNo))
    }
  }
  enterProduct = (detailNo) => {
    const { formData, mappingSearch } = this.state
    const line = mappingSearch[detailNo]
    const row = formData.salesDetails.find((row) => row.detailNo === detailNo)
    this.setState({ detailLoading: true }, () => {
      this.saleAPI.getProductData(line.seqNo, formData.customerId).then((response) => {
        line.isVirtual = response.data.productType === 'VIRTUAL'
        row.productId = line.value
        row.productSeqNo = line.seqNo
        row.productName = response.data.name
        row.kindShortName = response.data.kindShortName
        row.norm = response.data.norm
        row.quantity = 1
        row.price = response.data.price
        row.amount = response.data.price
        row.color = ''
        row.unit = response.data.unit
        row.vendorProductId = response.data.vendorProductId
        this.setState({ formData, mappingSearch, detailLoading: false }, () => {
          this.refList[detailNo].qty.focus()
        })
      })
    })
  }
  clearProduct = (detailNo) => {
    const { formData } = this.state
    const row = formData.salesDetails.find((row) => row.detailNo === detailNo)
    row.productId = ''
    row.productSeqNo = null
    row.productName = ''
    row.kindShortName = ''
    row.norm = ''
    row.quantity = 1
    row.inventory = 0
    row.price = 0
    row.amount = 0
    row.remark = ''
    row.color = ''
    row.vendorProductId = ''
    this.setState({ formData })
  }
  onHistoryVisible = (detailNo, historyVisible) => {
    const { mappingSearch } = this.state
    const line = mappingSearch[detailNo]
    line.historyVisible = historyVisible
    this.setState({ mappingSearch }, () => {
      this.onHistoryVisibleChange(detailNo)
    })
  }
  onPriceEnter = (detailNo, event) => {
    if (event.keyCode === 13) {
      this.onPriceFocusSwitch = false
      this.refList[detailNo].remark.focus()
    } else if (event.keyCode === 9) {
      this.onPriceFocusSwitch = false
    }
  }
  onNoteKeydown = (detailNo, event) => {
    if (event.keyCode === 13) {
      this.refList[detailNo].color.focus()
    }
  }
  onColorKeydown = (detailNo, event) => {
    if (event.keyCode === 13) {
      const { mappingSearch } = this.state
      const keys = Object.keys(mappingSearch)
      const index = keys.indexOf(detailNo.toString())
      if (index + 1 < keys.length) {
        this.refList[keys[index + 1]].productId.focus()
      } else {
        this.onProductAdd()
      }
    }
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
  onDetailNumberKeydown = (detailNo, event) => {
    if (event.keyCode === 13) {
      this.refList[detailNo].price.focus()
    }
  }

  onProductAdd = () => {
    const { formData, mappingSearch } = this.state
    const detailNo = formData.salesDetails[formData.salesDetails.length - 1].detailNo + 1
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
      search: '',
      value: '',
      seqNo: null,
      isVirtual: false,
      select: {},
      selectVisible: false,
      selectFinished: false,
      historyVisible: false,
      historySeqNo: null,
      historyLoading: true,
      historyData: {}
    }
    this.refList[detailNo] = {
      productId: null,
      qty: null,
      price: null,
      remark: null,
      color: null
    }
    this.setState({ formData, mappingSearch }, () => this.refList[detailNo].productId.focus())
  }
  onProductDelete = (detailNo) => {
    const { formData, mappingSearch } = this.state
    const index = formData.salesDetails.findIndex((record) => record.detailNo === detailNo)
    formData.salesDetails.splice(index, 1)
    delete mappingSearch[detailNo]
    this.setState({ formData, mappingSearch }, () => delete this.refList[detailNo])
  }

  onHistoryVisibleChange = (detailNo) => {
    const { formData, mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    if (row.seqNo && row.seqNo !== row.historySeqNo) {
      row.historyLoading = true
      this.setState({ mappingSearch, priceTabKey: 'purchase' }, () => {
        this.saleAPI
          .getProductHistoryPrice(row.seqNo, formData.customerId)
          .then((response) => {
            mappingSearch[detailNo].historySeqNo = row.seqNo
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
      })
    }
  }
  displayHistoryPrice = (detailNo) => {
    const { mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    return (
      <Spin spinning={row.historyLoading}>
        <div style={{ minHeight: 200 }}>
          <Card className='purchase-history-card'>
            <Row gutter={12}>
              <Col span={8}>
                定價1:{' '}
                <span style={{ color: '#2a9d8f' }}>
                  {`$ ${row.historyData.price1}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </Col>
              <Col span={8}>
                定價2:{' '}
                <span style={{ color: '#2a9d8f' }}>
                  {`$ ${row.historyData.price2}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </Col>
              <Col span={8}>
                定價3:{' '}
                <span style={{ color: '#2a9d8f' }}>
                  {`$ ${row.historyData.price3}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </Col>
              <Col span={24}>
                上次價格與日期:{' '}
                <span style={{ color: '#2a9d8f' }}>
                  {`$ ${row.historyData.lastSalesPrice}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>{' '}
                / <span style={{ color: '#2a9d8f' }}>{row.historyData.lastSalesDate}</span>
              </Col>
            </Row>
          </Card>
          {Object.keys(row.historyData).length > 0 && (
            <>
              <Tabs activeKey={this.state.priceTabKey}>
                <Tabs.TabPane
                  key='purchase'
                  tab={
                    <span onMouseEnter={() => this.setState({ priceTabKey: 'purchase' })}>
                      歷史進價
                    </span>
                  }
                >
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
                <Tabs.TabPane
                  key='sale'
                  tab={
                    <span onMouseEnter={() => this.setState({ priceTabKey: 'sale' })}>
                      歷史售價
                    </span>
                  }
                >
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
      dataIndex: 'price',
      title: '進價',
      width: 100,
      render: (price) => `$ ${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
      render: (price) => {
        return `$ ${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  ]

  // 新增
  handleCreate = (back, print) => {
    this.setState({ loading: true }, () => {
      const { formData } = this.state
      formData.accountDate = moment(formData.accountDate).format('YYYY-MM-DD')
      formData.salesDetails = formData.salesDetails.filter((record) => record.productSeqNo !== null)
      this.saveSaleData(true, formData)
        .then((salesId) => {
          message.success('成功新增資料')
          if (back) {
            if (print) {
              window.open(`${window.location.href.split('#')[0]}#/Sale/Print/${salesId}`)
            }
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
        .then(() => resolve(salesId))
        .catch((response) => {
          message.error(response.data.message)
          reject(false)
        })
    })
    await new Promise((resolve, reject) => {
      this.saleAPI
        .saveSalePayFlag(salesId, formData.pay)
        .then(() => resolve(salesId))
        .catch((response) => {
          message.error(response.data.message)
          reject(false)
        })
    })
    return salesId
  }

  openPrint = () => {
    window.open(`${window.location.href.split('#')[0]}#/Sale/Print/${this.props.salesId}`)
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
      <div id='sale-form-wrapper'>
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
              {!this.props.createFlag && (
                <Col span={24}>
                  <FormItem
                    title='銷售單號'
                    content={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#2a9d8f' }}>{this.props.salesId}</span>
                        {this.state.deliveryLog && (
                          <Button
                            className='sale-delivery-switch'
                            size='small'
                            onClick={() => this.setState({ deliveryVisible: true })}
                          >
                            <SaleDeliveryIcon />
                          </Button>
                        )}
                      </div>
                    }
                  />
                </Col>
              )}
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
                      autoFocus={true}
                      value={this.state.formData.customerId}
                      searchValue={this.state.search.customerId}
                      showSearch={true}
                      showArrow={false}
                      filterOption={false}
                      options={this.getCustomerOptions()}
                      onSearch={this.onCodeSearch}
                      onSelect={this.onCodeSelect}
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
                  // align='flex-start'
                  content={
                    <Input
                      value={this.state.formData.note}
                      id='note'
                      // autoSize={{ minRows: 1, maxRows: 4 }}
                      ref={(remarkRef) => (this.remarkRef = remarkRef)}
                      style={{ width: '100%' }}
                      onChange={this.onInputChange}
                      onKeyDown={this.onRemarkKeydown}
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
                    disabled={this.state.formData.customerId === ''}
                    onClick={this.handleCreate.bind(this, true, false)}
                  >
                    儲存
                  </Button>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    disabled={this.state.formData.customerId === ''}
                    onClick={this.handleCreate.bind(this, false, false)}
                  >
                    儲存並繼續新增
                  </Button>
                  <Button
                    className='form-option-print'
                    icon={<PrinterOutlined />}
                    disabled={this.state.formData.customerId === ''}
                    onClick={this.handleCreate.bind(this, true, true)}
                  >
                    儲存並列印
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
          {this.state.deliveryLog && (
            <>
              <Modal
                className='sales-delivery-log-modal'
                visible={this.state.deliveryVisible}
                title='送貨狀況'
                footer={null}
                onCancel={() => this.setState({ deliveryVisible: false })}
              >
                <table className='view-product-table'>
                  <tr>
                    <th>送貨員</th>
                    <th>出貨時間</th>
                    <th>送貨更新</th>
                  </tr>
                  <tr>
                    <td>{this.state.deliveryLog.deliveryMan}</td>
                    <td>{this.state.deliveryLog.timeStamp || '--'}</td>
                    <td>{this.state.deliveryLog.chTime || '--'}</td>
                  </tr>
                </table>
                <table className='view-product-table'>
                  <tr>
                    <th>問題回報</th>
                  </tr>
                  <tr>
                    <td>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: !this.state.deliveryLog.replyDesc
                            ? '--'
                            : this.state.deliveryLog.replyDesc.replace('\n', '<br />')
                        }}
                      />
                    </td>
                  </tr>
                </table>
                <table className='view-product-table addition'>
                  <tr>
                    <td>
                      <div>
                        {!this.state.deliveryLog.pic1Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img
                            src={this.state.deliveryLog.pic1Url}
                            alt={this.state.deliveryLog.salesId}
                            onClick={() =>
                              this.setState({
                                deliveryPic: this.state.deliveryLog.pic1Url,
                                deliveryPicVisible: true
                              })
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {!this.state.deliveryLog.pic2Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img
                            src={this.state.deliveryLog.pic2Url}
                            alt={this.state.deliveryLog.salesId}
                            onClick={() =>
                              this.setState({
                                deliveryPic: this.state.deliveryLog.pic2Url,
                                deliveryPicVisible: true
                              })
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {!this.state.deliveryLog.pic3Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img
                            src={this.state.deliveryLog.pic3Url}
                            alt={this.state.deliveryLog.salesId}
                            onClick={() =>
                              this.setState({
                                deliveryPic: this.state.deliveryLog.pic3Url,
                                deliveryPicVisible: true
                              })
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {!this.state.deliveryLog.pic4Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img
                            src={this.state.deliveryLog.pic4Url}
                            alt={this.state.deliveryLog.salesId}
                            onClick={() =>
                              this.setState({
                                deliveryPic: this.state.deliveryLog.pic4Url,
                                deliveryPicVisible: true
                              })
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                </table>
              </Modal>
              <Modal
                className='product-real-pic-modal'
                visible={this.state.deliveryPicVisible}
                title={null}
                footer={null}
                onCancel={() => this.setState({ deliveryPicVisible: false })}
              >
                <img src={this.state.deliveryPic} alt='照片放大' />
              </Modal>
            </>
          )}
        </Spin>
      </div>
    )
  }
}
