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
  Table,
  Space,
  Button,
  Modal,
  message,
  InputNumber
} from 'antd'
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ListDeleteIcon, ListSearchIcon } from '../icon/Icon'
import { FormItem } from '../../component/FormItem'
import { createHashHistory } from 'history'
import { initData, formRules } from './saleType'
import SaleAPI from '../../model/api/sale'
import moment from 'moment'

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
      formStatus: JSON.parse(JSON.stringify(formRules)),
      recordStatus: {},
      search: {
        vendorId: ''
      },
      detailLoading: false,
      mappingSearch: {},
      customerList: [],
      colorList: [],
      canSubmit: false
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
          formStatus: JSON.parse(JSON.stringify(formRules)),
          recordStatus: {},
          search: {
            vendorId: ''
          },
          detailLoading: false,
          mappingSearch: {},
          canSubmit: false
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
            const recordStatus = {}
            const mappingSearch = {}
            response.data.salesDetails.forEach((record) => {
              mappingSearch[record.detailNo] = {
                loading: false,
                value: record.productId,
                seqNo: record.productSeqNo,
                search: '',
                searchTime: 0,
                list: [],
                select: {},
                historyLoading: true,
                historyList: []
              }
              recordStatus[record.detailNo] = JSON.parse(JSON.stringify(recordStatus))
            })
            this.setState(
              {
                loading: false,
                formData: {
                  ...response.data.salesMaster,
                  accountDate: moment(response.data.salesMaster.accountDate, 'YYYY-MM-DD')
                    .startOf('day')
                    .valueOf(),
                  salesDetails: response.data.salesDetails
                },
                recordStatus,
                mappingSearch
              },
              () => {
                this.getMappingProducts(mappingSearch).then((mappingSearch) =>
                  this.setState({ mappingSearch }, () =>
                    this.checkCanSubmit().then(() => resolve(true))
                  )
                )
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
  getMappingProducts = async (mappingSearch) => {
    const seqNos = Object.keys(mappingSearch)
    for (const seqNo of seqNos) {
      await new Promise((resolve) => {
        this.saleAPI.searchProductMapping(true, mappingSearch[seqNo].value).then((response) => {
          mappingSearch[seqNo].list = response.data
          mappingSearch[seqNo].select = response.data[0]
          resolve(true)
        })
      })
    }
    return Promise.resolve(mappingSearch)
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
  onDateChange = (type, date) => {
    const { formData } = this.state
    formData[type] = date
    this.checkData(formData, type)
  }
  onSwitchChange = (type, checked) => {
    const { formData } = this.state
    formData[type] = checked
    this.checkData(formData, type)
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
    this.setState({ search }, () => this.checkData(formData, key))
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
        width: 400,
        fixed: 'left',
        render: (data, row) => {
          const { mappingSearch } = this.state
          const line = mappingSearch[row.detailNo]
          // return data
          return (
            <Spin spinning={line.loading}>
              <Select
                showSearch={true}
                showArrow={false}
                value={line.value}
                searchValue={line.search}
                onSearch={_this.onMappingSearch.bind(_this, row.detailNo)}
                onSelect={_this.onMappingSelect.bind(_this, row.detailNo)}
                optionFilterProp='children'
                style={{ width: '100%' }}
                notFoundContent={null}
                className='product-search'
              >
                {line.list.map((product) => (
                  <Select.Option key={product.data} value={product.data}>
                    {_this.getMappingProductDisplay(product)}
                  </Select.Option>
                ))}
              </Select>
            </Spin>
          )
        }
      },
      {
        dataIndex: 'productName',
        title: '商品名稱',
        width: 240,
        render: (data, row) => {
          return row.productSeqNo && data
        }
      },
      {
        dataIndex: 'kindShortName',
        title: '車種簡稱',
        width: 160,
        render: (data, row) => {
          return row.productSeqNo && data
        }
      },
      {
        dataIndex: 'norm',
        title: '規格',
        width: 120,
        render: (data, row) => {
          return row.productSeqNo && data
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
      {
        dataIndex: 'price',
        title: '售價',
        width: 140,
        render: (data, row) => {
          return (
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
              {/* <div className='purchase-price-view'>
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
              </div> */}
            </div>
          )
        }
      },
      {
        dataIndex: 'amount',
        title: '金額',
        width: 140,
        render: (data) => {
          return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        dataIndex: 'remark',
        title: '備註',
        width: 300,
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
        width: 200,
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
      this.setState({ formData }, () => this.checkRecordData(detailNo, record, key))
    }
  }
  onDetailSelectChange = (detailNo, key, value) => {
    const { formData } = this.state
    const record = formData.salesDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = value
      this.setState({ formData }, () => this.checkRecordData(detailNo, record, key))
    }
  }
  onDetailNumberChange = (detailNo, key, value) => {
    const { formData } = this.state
    const record = formData.salesDetails.find((record) => record.detailNo === detailNo)
    if (record) {
      record[key] = value
      record.amount = record.quantity * record.price
      this.setState({ formData }, () => this.checkRecordData(detailNo, record, key))
    }
  }

  onProductAdd = () => {
    const { formData, recordStatus, mappingSearch } = this.state
    const detailNo = formData.salesDetails.length + 1
    formData.salesDetails.push({
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
    recordStatus[detailNo] = JSON.parse(JSON.stringify(recordStatus))
    mappingSearch[detailNo] = {
      loading: false,
      value: '',
      seqNo: null,
      search: '',
      searchTime: 0,
      list: [],
      select: {},
      historyLoading: true,
      historyList: []
    }
    this.setState({ formData, recordStatus, mappingSearch })
  }
  onProductDelete = (detailNo) => {
    const { formData, recordStatus, mappingSearch } = this.state
    const index = formData.salesDetails.findIndex((record) => record.detailNo === detailNo)
    formData.salesDetails.splice(index, 1)
    delete recordStatus[detailNo]
    delete mappingSearch[detailNo]
    this.setState({ formData, recordStatus, mappingSearch })
  }

  // onVisibleChange = (detailNo, visible) => {
  //   const { mappingSearch } = this.state
  //   const row = mappingSearch[detailNo]
  //   if (visible && row.seqNo && row.historyLoading) {
  //     this.purchaseAPI
  //       .getProductHistoryPrice(row.seqNo)
  //       .then((response) => {
  //         mappingSearch[detailNo].historyLoading = false
  //         mappingSearch[detailNo].historyList = response.data.map((price, index) => {
  //           return {
  //             ...price,
  //             index
  //           }
  //         })
  //         this.setState({ mappingSearch })
  //       })
  //       .catch(() => {
  //         mappingSearch[detailNo].historyLoading = false
  //         this.setState({ mappingSearch })
  //       })
  //   }
  // }
  // displayHistoryPrice = (detailNo) => {
  //   const { mappingSearch } = this.state
  //   const row = mappingSearch[detailNo]
  //   return (
  //     <Table
  //       className='purchase-history-list'
  //       rowKey='index'
  //       size='small'
  //       columns={this.getHistoryColumns()}
  //       dataSource={row.historyList}
  //       scroll={{ y: 240 }}
  //       loading={row.historyLoading}
  //       pagination={false}
  //     />
  //   )
  // }
  // getHistoryColumns = () => [
  //   {
  //     dataIndex: 'accountDate',
  //     title: '日期',
  //     width: 100
  //   },
  //   {
  //     dataIndex: 'vendorName',
  //     title: '廠商名稱',
  //     width: 180
  //   },
  //   {
  //     dataIndex: 'amount',
  //     title: '進價',
  //     width: 100,
  //     render: (data, row) => {
  //       const price = data / row.quantity
  //       return `$ ${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //     }
  //   }
  // ]

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
  onMappingSearch = (detailNo, value) => {
    const { mappingSearch } = this.state
    mappingSearch[detailNo].search = value
    mappingSearch[detailNo].searchTime = moment().valueOf()
    this.setState({ mappingSearch }, () => {
      setTimeout(() => {
        if (moment().valueOf() - mappingSearch[detailNo].searchTime >= 1000 && value !== '') {
          mappingSearch[detailNo].loading = true
          this.setState({ mappingSearch }, () => {
            this.saleAPI
              .searchProductMapping(true, value)
              .then((response) => {
                mappingSearch[detailNo].loading = false
                mappingSearch[detailNo].list = response.data
                this.setState({ mappingSearch })
              })
              .catch(() => {
                mappingSearch[detailNo].loading = false
                this.setState({ mappingSearch })
              })
          })
        } else if (value === '') {
          if (mappingSearch[detailNo].value !== '') {
            mappingSearch[detailNo].list = [mappingSearch[detailNo].select]
          } else {
            mappingSearch[detailNo].list = []
          }
          this.setState({ mappingSearch })
        }
      }, 1000)
    })
  }
  onMappingSelect = (detailNo, value) => {
    const { formData, mappingSearch } = this.state
    const product = mappingSearch[detailNo].list.find((product) => product.data === value)
    if (product) {
      const row = formData.salesDetails.find((row) => row.detailNo === detailNo)
      if (product.finished) {
        mappingSearch[detailNo].search = ''
        mappingSearch[detailNo].value = product.data
        mappingSearch[detailNo].seqNo = product.productSeqNo
        mappingSearch[detailNo].list = [product]
        mappingSearch[detailNo].select = product
        this.setState({ mappingSearch, detailLoading: true }, () => {
          this.saleAPI.getProductData(product.productSeqNo).then((response) => {
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
      } else {
        mappingSearch[detailNo].search = value
        mappingSearch[detailNo].value = product.data
        mappingSearch[detailNo].seqNo = product.productSeqNo
        mappingSearch[detailNo].list = [product]
        mappingSearch[detailNo].select = product
        row.productId = product.data
        row.productSeqNo = null
        row.productName = ''
        row.kindShortName = ''
        row.norm = ''
        row.quantity = 1
        row.price = 0
        row.amount = 0
        row.color = ''
        row.unit = ''
        row.vendorProductId = ''
        this.setState({ formData, mappingSearch })
      }
    }
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
  checkRecordData = (detailNo, record, fieldKey) => {
    const { recordStatus } = this.state
    const status = recordStatus[detailNo]
    if (status) {
    }
    this.setState({ recordStatus }, () => this.checkCanSubmit())
  }
  checkCanSubmit = () => {
    return new Promise((resolve) => {
      let recordError = false
      const keys = Object.keys(this.state.recordStatus)
      for (const key of keys) {
        if (this.state.recordStatus[key].error) {
          recordError = true
          break
        }
      }
      this.setState(
        {
          canSubmit: !this.state.formStatus.some((field) => field.error) && !recordError
        },
        () => resolve(true)
      )
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
              formStatus: JSON.parse(JSON.stringify(formRules)),
              search: {
                vendorId: ''
              },
              canSubmit: false
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
            message.error(error.response.data.message)
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
          .catch(() => {
            message.error('資料更新失敗')
            reject(false)
          })
      })
    }
    await new Promise((resolve, reject) => {
      this.saleAPI
        .saveSaleConfirmFlag(salesId, formData.confirm)
        .then(() => resolve(true))
        .catch(() => {
          message.error('資料更新失敗')
          reject(false)
        })
    })
    await new Promise((resolve, reject) => {
      this.saleAPI
        .saveSalePayFlag(salesId, formData.pay)
        .then(() => resolve(true))
        .catch(() => {
          message.error('資料更新失敗')
          reject(false)
        })
    })
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
                  required={true}
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
                  required={true}
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
                  required={false}
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
                  message='長度需在255字內'
                  error={this.getFormErrorStatus('note')}
                />
              </Col>
              <Col span={24}>
                <FormItem
                  required={false}
                  title='已收款'
                  content={
                    <Switch
                      checked={this.state.formData.pay}
                      onChange={this.onSwitchChange.bind(this, 'pay')}
                    />
                  }
                  error={this.getFormErrorStatus('pay')}
                />
              </Col>
              <Col span={24}>
                <FormItem
                  required={false}
                  title='已回單'
                  content={
                    <Switch
                      checked={this.state.formData.confirm}
                      onChange={this.onSwitchChange.bind(this, 'confirm')}
                    />
                  }
                  error={this.getFormErrorStatus('confirm')}
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
              scroll={{ x: 1900 }}
              loading={this.state.detailLoading}
              pagination={false}
            />
          </Card>
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
        </Spin>
      </>
    )
  }
}
