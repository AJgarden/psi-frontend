import React from 'react'
import { createHashHistory } from 'history'
import {
  Button,
  Col,
  Input,
  Select,
  DatePicker,
  Row,
  Space,
  Table,
  Tooltip,
  Modal
} from 'antd'
import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ListAddIcon,
  ListSearchIcon,
  ListEditIcon,
  ListDeleteIcon,
  UtilCloseIcon
} from '../icon/Icon'
import { PageDrawer } from '../../component/PageDrawer'
import { getPaginationSetting } from '../../component/paginationSetting'
import PurchaseDetail from './PurchaseDetail'
import PurchaseAPI from '../../model/api/purchase'

export default class Purchase extends React.Component {
  history = createHashHistory()
  purchaseAPI = new PurchaseAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        date: [
          moment().startOf('month').startOf('day'),
          moment().endOf('month').startOf('day')
        ],
        id: undefined,
        keyword: ''
      },
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        position: ['bottomLeft']
      },
      detailPurchaseId: 0,
      detailVisible: false
    }
    this.getList()
  }

  getList = () => {
    const { search, pagination } = this.state
    const requestData = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }
    if (search.id) {
      requestData.queryBy = search.id
      requestData.condition = search.keyword
    }
    if (search.date) {
      requestData.beginDate = search.date[0].format('YYYY-MM-DD')
      requestData.endDate = search.date[1].format('YYYY-MM-DD')
    }
    this.purchaseAPI
      .getPurchaseList(requestData)
      .then(response => {
        pagination.total = response.data.total
        this.setState({ loading: false, list: response.data.list, pagination })
      })
      .catch(() => this.setState({ loading: false }))
  }

  // search
  onDateChange = date => {
    const { search } = this.state
    search.date = date
    this.setState({ search, loading: true, list: [] }, () => this.getList())
  }
  onSelectChange = value => {
    const { search } = this.state
    search.id = value
    if (!value) search.keyword = ''
    this.setState({ search })
  }
  onInputChange = e => {
    const { search } = this.state
    search.keyword = e.target.value
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
        dataIndex: 'purchaseId',
        title: '執行',
        width: 50,
        render: (purchaseId) => (
          <Space className='list-table-option'>
            <Tooltip title='編輯'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onDetailOpen.bind(_this, purchaseId)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='刪除'>
              <Button
                className='list-table-option-delete'
                size='small'
                onClick={_this.handleDelete.bind(_this, purchaseId)}
              >
                <ListDeleteIcon />
              </Button>
            </Tooltip>
          </Space>
        )
      },
      {
        title: '序',
        width: 30,
        align: 'center',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '日期',
        dataIndex: 'accountDate'
      },
      {
        title: '進貨編號',
        dataIndex: 'purchaseId'
      },
      {
        title: '廠商代號',
        dataIndex: 'vendorId'
      },
      {
        title: '廠商名稱',
        dataIndex: 'vendorName'
      },
      {
        title: '總金額',
        dataIndex: 'totalAmount',
        align: 'right',
        render: (data) => {
          return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      }
    ]
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

  onDetailOpen = (detailPurchaseId) =>
    this.setState({ detailPurchaseId, detailVisible: true })
  onDetailClose = () => this.setState({ detailVisible: false })

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
                  onClick={() => this.history.push('/Purchase/Add')}
                  className='list-header-add'
                >
                  新增
                </Button>
                <DatePicker.RangePicker
                  defaultValue={this.state.search.date}
                  allowClear={false}
                  onChange={this.onDateChange}
                />
              </Space>
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder='搜尋欄位'
                  value={this.state.search.id}
                  allowClear={true}
                  onChange={this.onSelectChange}
                >
                  <Select.Option value='PURCHASE_ID'>進貨單號</Select.Option>
                  <Select.Option value='VENDOR_ID'>廠商代號</Select.Option>
                  <Select.Option value='NOTE'>備註</Select.Option>
                </Select>
                <Input
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
          rowKey='purchaseId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          pagination={getPaginationSetting(
            this.state.pagination,
            this.onPageChange
          )}
        />
        <PageDrawer
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
        </PageDrawer>
      </>
    )
  }
}
