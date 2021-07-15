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
  InputNumber,
  AutoComplete
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ListDeleteIcon, ListSearchIcon } from '../icon/Icon'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import moment from 'moment'
import SelectProductHover from '../utils/SelectProductHover'
import ViewProductModal from '../utils/ViewProductModal'
import { initData } from './purchaseType'
import PurchaseAPI from '../../model/api/purchase'

export default class PurchaseForm extends React.Component {
  history = createHashHistory()
  purchaseAPI = new PurchaseAPI()
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
      search: {
        vendorId: ''
      },
      detailLoading: false,
      mappingSearch: {},
      vendorList: [],
      remarkList: [],
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
    await new Promise((resolve) => {
      this.purchaseAPI.getRemarkList().then((response) => {
        this.setState(
          { remarkList: response.data.filter((value) => value !== '').map((value) => ({ value })) },
          () => resolve(true)
        )
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
                historyList: []
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
                  ...response.data.purchaseMaster,
                  accountDate: moment(
                    response.data.purchaseMaster.accountDate,
                    'YYYY-MM-DD'
                  ).startOf('day'),
                  purchaseDetails: response.data.purchaseDetails
                },
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
    formData[type] = moment(date).valueOf()
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
      search.vendorId = value.toUpperCase()
      this.setState({ search })
    }
  }
  onCodeSelect = (value) => {
    const { formData, mappingSearch, search, vendorList } = this.state
    if (formData.vendorId === '') {
      formData.purchaseDetails = [
        {
          detailNo: 1,
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
        historyList: []
      }
      this.refList[1] = {
        productId: null,
        qty: null,
        price: null,
        remark: null,
        color: null
      }
    }
    search.vendorId = ''
    formData.vendorId = value
    const vendor = vendorList.find(
      (vendor) => vendor.vendorId.toLowerCase() === value.toLowerCase()
    )
    if (vendor) formData.vendorName = vendor.name
    this.setState({ search, formData, mappingSearch }, () => this.remarkRef.focus())
  }
  // get code options
  getVendorOptions = () => {
    const { formData, search, vendorList } = this.state
    let list = []
    if (search.vendorId === '') {
      if (formData.vendorId === '') {
        list = vendorList.slice()
      } else {
        list = vendorList.filter((vendor) => formData.vendorId === vendor.vendorId)
      }
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(search.vendorId)) {
      list = vendorList.filter(
        (vendor) => formData.vendorId === vendor.vendorId || vendor.name.includes(search.vendorId)
      )
    } else {
      list = vendorList.filter(
        (vendor) =>
          formData.vendorId === vendor.vendorId ||
          (search.vendorId &&
            vendor.vendorId.toLowerCase().match(`^${search.vendorId.toLowerCase()}`, 'i'))
      )
    }
    return list.map((vendor) => ({
      label: `${vendor.vendorId} - ${vendor.name}`,
      value: vendor.vendorId
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
                ref={(target) => (_this.refList[row.detailNo].qty = target)}
                onKeyDown={_this.onDetailNumberKeydown.bind(_this, row.detailNo)}
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
    const row = formData.purchaseDetails.find((row) => row.detailNo === detailNo)
    this.setState({ detailLoading: true }, () => {
      this.purchaseAPI.getProductData(line.seqNo).then((response) => {
        line.isVirtual = response.data.productType === 'VIRTUAL'
        row.productId = line.value
        row.productSeqNo = line.seqNo
        row.productName = response.data.name
        row.kindShortName = response.data.kindShortName
        row.norm = response.data.norm
        row.quantity = 1
        row.price = 0
        row.amount = 0
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
    const row = formData.purchaseDetails.find((row) => row.detailNo === detailNo)
    row.productId = ''
    row.productSeqNo = null
    row.productName = ''
    row.kindShortName = ''
    row.norm = ''
    row.quantity = 1
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
  onDetailNumberKeydown = (detailNo, event) => {
    if (event.keyCode === 13) {
      this.refList[detailNo].price.focus()
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
      historyList: []
    }
    this.refList[detailNo] = {
      productId: null,
      qty: null,
      price: null,
      remark: null,
      color: null
    }
    this.setState({ formData, mappingSearch })
  }
  onProductDelete = (detailNo) => {
    const { formData, mappingSearch } = this.state
    const index = formData.purchaseDetails.findIndex((record) => record.detailNo === detailNo)
    formData.purchaseDetails.splice(index, 1)
    delete mappingSearch[detailNo]
    this.setState({ formData, mappingSearch }, () => delete this.refList[detailNo])
  }

  onHistoryVisibleChange = (detailNo, visible) => {
    const { mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    if (row.seqNo && row.seqNo !== row.historySeqNo) {
      row.historyLoading = true
      this.setState({ mappingSearch }, () => {
        this.purchaseAPI
          .getProductHistoryPrice(row.seqNo)
          .then((response) => {
            mappingSearch[detailNo].historySeqNo = row.seqNo
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
      })
    }
  }
  displayHistoryPrice = (detailNo) => {
    const { mappingSearch } = this.state
    const row = mappingSearch[detailNo]
    return (
      <Spin spinning={row.historyLoading}>
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
      </Spin>
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
      <div id='sale-form-wrapper'>
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
              {!this.props.createFlag && (
                <Col span={24}>
                  <FormItem
                    title='進貨單號'
                    content={<span style={{ color: '#2a9d8f' }}>{this.props.purchaseId}</span>}
                  />
                </Col>
              )}
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
                      autoFocus={true}
                      value={this.state.formData.vendorId}
                      searchValue={this.state.search.vendorId}
                      showSearch={true}
                      showArrow={false}
                      options={this.getVendorOptions()}
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
                  align='flex-start'
                  content={
                    <Input.TextArea
                      value={this.state.formData.note}
                      id='note'
                      autoSize={{ minRows: 4, maxRows: 4 }}
                      ref={(remarkRef) => (this.remarkRef = remarkRef)}
                      onChange={this.onInputChange}
                      onKeyDown={this.onRemarkKeydown}
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
      </div>
    )
  }
}
