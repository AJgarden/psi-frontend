import React from 'react'
import { createHashHistory } from 'history'
import {
  Button,
  Col,
  Input,
  Select,
  DatePicker,
  Switch,
  Row,
  Space,
  Table,
  Tooltip,
  Modal,
  message
} from 'antd'
import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ListAddIcon,
  ListSearchIcon,
  ListEditIcon,
  ListTickIcon,
  ListPrintIcon
  // UtilCloseIcon
} from '../icon/Icon'
// import { PageDrawer } from '../../component/PageDrawer'
import { getPaginationSetting } from '../../component/paginationSetting'
import SaleAPI from '../../model/api/sale'
import StaticStorage from '../../model/storage/static'

export default class Sale extends React.Component {
  history = createHashHistory()
  saleAPI = new SaleAPI()
  staticStorage = new StaticStorage()

  constructor(props) {
    super(props)
    const search = StaticStorage.saleSearch.isSearch
      ? JSON.parse(JSON.stringify(StaticStorage.saleSearch))
      : {
          date: [
            moment().startOf('month').startOf('day').format('YYYY-MM-DD'),
            moment().endOf('month').startOf('day').format('YYYY-MM-DD')
          ],
          id: undefined,
          keyword: '',
          confirm: 'ALL'
        }
    this.state = {
      loading: true,
      search,
      list: [],
      pagination: {
        current: StaticStorage.saleSearch.isSearch ? StaticStorage.saleSearch.currentPage : 1,
        total: 0,
        pageSize: 10,
        position: ['bottomLeft']
      },
      detailPurchaseId: 0,
      detailVisible: false
    }
    this.staticStorage.setSaleSearch({})
    this.getList()
  }

  getList = () => {
    const { search, pagination } = this.state
    const requestData = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      confirmQueryEnum: search.confirm
    }
    if (search.id) {
      requestData.queryBy = search.id
      requestData.condition = search.keyword
    }
    if (search.date) {
      requestData.beginDate = search.date[0]
      requestData.endDate = search.date[1]
    }
    this.saleAPI
      .getSaleList(requestData)
      .then((response) => {
        pagination.total = response.data.total
        this.setState({ loading: false, list: response.data.list, pagination })
      })
      .catch(() => this.setState({ loading: false }))
  }

  // search
  onDateChange = (date) => {
    const { search, pagination } = this.state
    pagination.current = 1
    search.date = date.map((str) => moment(str).format('YYYY-MM-DD'))
    this.setState({ search, pagination, loading: true, list: [] }, () => this.getList())
  }
  onSelectChange = (key, value) => {
    const { search, pagination } = this.state
    search[key] = value
    if (key === 'id' && !value) {
      search.keyword = ''
      pagination.current = 1
      this.setState({ loading: true, list: [], search, pagination }, () => this.getList())
    } else {
      this.setState({ search })
    }
  }
  onInputChange = (e) => {
    const { search } = this.state
    search.keyword = e.target.value
    this.setState({ search })
  }
  onCheckChange = (e) => {
    const { search } = this.state
    search.unConfirm = e.target.checked
    this.setState({ search })
  }
  handleSearch = () => {
    const { pagination } = this.state
    pagination.current = 1
    this.setState({ loading: true, list: [], pagination }, () => this.getList())
  }

  getColumns = () => {
    const _this = this
    const { pagination } = this.state
    return [
      {
        dataIndex: 'salesId',
        title: '執行',
        fixed: 'left',
        width: 70,
        render: (salesId) => (
          <Space className='list-table-option'>
            <Tooltip title='編輯'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onDetailOpen.bind(_this, salesId)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='列印'>
              <Button
                className='list-table-option-print'
                size='small'
                onClick={_this.openPrint.bind(_this, salesId)}
              >
                <ListPrintIcon />
              </Button>
            </Tooltip>
          </Space>
        )
      },
      {
        title: '已回單',
        dataIndex: 'confirm',
        fixed: 'left',
        align: 'center',
        width: 60,
        render: (record, row) => {
          return (
            <Switch
              checked={record}
              onChange={_this.onConfirmChange.bind(_this, row.salesId, !record)}
            />
          )
        }
      },
      {
        title: '序',
        width: 80,
        fixed: 'left',
        align: 'center',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '銷貨編號',
        dataIndex: 'salesId',
        fixed: 'left',
        width: 140
      },
      {
        title: '日期',
        dataIndex: 'accountDate',
        width: 140
      },
      {
        title: '客戶代號',
        dataIndex: 'customerId',
        width: 140
      },
      {
        title: '客戶名稱',
        dataIndex: 'customerName'
      },
      {
        title: '總金額',
        dataIndex: 'totalAmount',
        width: 140,
        fixed: 'right',
        align: 'right',
        render: (data) => {
          return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        title: '已收款',
        dataIndex: 'pay',
        fixed: 'right',
        align: 'center',
        width: 60,
        render: (record) => {
          return record && <ListTickIcon className='list-table-tick' />
        }
      }
    ]
  }

  openPrint = (salesId) => {
    const url = `${window.location.href.split('#')[0]}#/Sale/Print/${salesId}`
    window.open(url)
  }

  onConfirmChange = (salesId, status) => {
    const { list } = this.state
    const row = list.find((record) => record.salesId === salesId)
    row.confirm = status
    this.setState({ loading: true, list }, () => {
      this.saleAPI
        .saveSaleConfirmFlag(salesId, status)
        .then(() => this.getList())
        .catch(() => {
          message.error('修改回單狀態失敗')
          row.confirm = !status
          this.setState({ loading: false, list })
        })
    })
  }

  handleDelete = (seqNo) => {
    Modal.confirm({
      title: '確定要刪除此筆資料嗎',
      icon: <ExclamationCircleOutlined />,
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        console.log('delete: ' + seqNo)
      }
    })
  }

  onPageChange = (page, pageSize) => {
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ loading: true, list: [], pagination }, () => this.getList())
  }

  onDetailOpen = (salesId) => {
    this.staticStorage.setSaleSearch({
      ...this.state.search,
      currentPage: this.state.pagination.current,
      isSearch: true
    })
    this.history.push(`/Sale/Detail/${salesId}`)
  }
  // onDetailOpen = (detailPurchaseId) =>
  //   this.setState({ detailPurchaseId, detailVisible: true })
  // onDetailClose = () => this.setState({ detailVisible: false })

  render() {
    return (
      <>
        <div className='list-header'>
          <Row type='flex' justify='space-between'>
            <Col>
              <Space>
                <Button
                  type='primary'
                  icon={<ListAddIcon />}
                  onClick={() => {
                    this.staticStorage.setSaleSearch({
                      ...this.state.search,
                      isSearch: true
                    })
                    this.history.push('/Sale/Add')
                  }}
                  className='list-header-add'
                >
                  新增
                </Button>
                <DatePicker.RangePicker
                  defaultValue={this.state.search.date.map((dateStr) =>
                    moment(dateStr, 'YYYY-MM-DD')
                  )}
                  allowClear={false}
                  onChange={this.onDateChange}
                />
              </Space>
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder='回單狀態'
                  value={this.state.search.confirm}
                  onChange={this.onSelectChange.bind(this, 'confirm')}
                >
                  <Select.Option value='ALL'>全部</Select.Option>
                  <Select.Option value='Y'>已回單</Select.Option>
                  <Select.Option value='N'>未回單</Select.Option>
                </Select>
                <Select
                  placeholder='搜尋欄位'
                  value={this.state.search.id}
                  allowClear={true}
                  onChange={this.onSelectChange.bind(this, 'id')}
                  style={{ width: 100 }}
                >
                  <Select.Option value='SALES_ID'>銷貨單號</Select.Option>
                  <Select.Option value='CUSTOMER_ID'>顧客代號</Select.Option>
                  <Select.Option value='NOTE'>備註</Select.Option>
                </Select>
                <Input
                  value={this.state.search.keyword}
                  placeholder='搜尋內容'
                  allowClear={true}
                  onChange={this.onInputChange}
                />
                <Button
                  type='primary'
                  icon={<ListSearchIcon />}
                  onClick={this.handleSearch}
                  className='list-header-search'
                >
                  查詢
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
        <Table
          className='list-table-wrapper'
          rowKey='salesId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          scroll={{ x: 1110 }}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
        {/* <PageDrawer
          width={480}
          placement='right'
          closeIcon={<UtilCloseIcon />}
          title={this.state.detailCreate ? '新增商品' : '編輯商品資料'}
          visible={this.state.detailVisible}
          onClose={this.onDetailClose}
        >
          <PurchaseDetail
            createFlag={false}
            isDrawMode={true}
            drawModeVisible={this.state.detailVisible}
            purchaseId={this.state.detailPurchaseId}
            onClose={this.onDetailClose}
          />
        </PageDrawer> */}
      </>
    )
  }
}
