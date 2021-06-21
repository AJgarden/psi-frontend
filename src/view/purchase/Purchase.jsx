import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Select, DatePicker, Row, Space, Table, Tooltip, Modal } from 'antd'
import moment from 'moment'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, ListSearchIcon, ListEditIcon, UtilCloseIcon } from '../icon/Icon'
import { PageDrawer } from '../../component/PageDrawer'
import { getPaginationSetting } from '../../component/paginationSetting'
import PurchaseAPI from '../../model/api/purchase'
import StaticStorage from '../../model/storage/static'

export default class Purchase extends React.Component {
  history = createHashHistory()
  purchaseAPI = new PurchaseAPI()
  staticStorage = new StaticStorage()

  constructor(props) {
    super(props)
    const search = StaticStorage.purchaseSearch.isSearch
      ? JSON.parse(JSON.stringify(StaticStorage.purchaseSearch))
      : {
          date: [
            moment().startOf('month').startOf('day').format('YYYY-MM-DD'),
            moment().endOf('month').startOf('day').format('YYYY-MM-DD')
          ],
          id: undefined,
          keyword: ''
        }
    this.state = {
      loading: true,
      search,
      list: [],
      pagination: {
        current: StaticStorage.purchaseSearch.isSearch ? StaticStorage.purchaseSearch.currentPage : 1,
        total: 0,
        pageSize: 10,
        position: ['bottomLeft']
      },
      detailPurchaseId: 0,
      detailVisible: false
    }
    this.staticStorage.setPurchaseSearch({})
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
      requestData.beginDate = search.date[0]
      requestData.endDate = search.date[1]
    }
    this.purchaseAPI
      .getPurchaseList(requestData)
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
  onSelectChange = (value) => {
    const { search, pagination } = this.state
    search.id = value
    if (!value) {
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
        fixed: 'left',
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
          </Space>
        )
      },
      {
        title: '序',
        width: 80,
        fixed: 'left',
        align: 'center',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '進貨單號',
        dataIndex: 'purchaseId',
        fixed: 'left',
        width: 140
      },
      {
        title: '日期',
        dataIndex: 'accountDate',
        width: 140
      },
      {
        title: '廠商代號',
        dataIndex: 'vendorId',
        width: 140
      },
      {
        title: '廠商名稱',
        dataIndex: 'vendorName'
      },
      {
        title: '總金額',
        dataIndex: 'totalAmount',
        fixed: 'right',
        align: 'right',
        width: 140,
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

  onDetailOpen = (purchaseId) => {
    this.staticStorage.setPurchaseSearch({
      ...this.state.search,
      currentPage: this.state.pagination.current,
      isSearch: true
    })
    this.history.push(`/Purchase/Detail/${purchaseId}`)
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
                    this.staticStorage.setPurchaseSearch({
                      ...this.state.search,
                      isSearch: true
                    })
                    this.history.push('/Purchase/Add')
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
                  placeholder='搜尋欄位'
                  value={this.state.search.id}
                  allowClear={true}
                  onChange={this.onSelectChange}
                  style={{ width: 100 }}
                >
                  <Select.Option value='PURCHASE_ID'>進貨單號</Select.Option>
                  <Select.Option value='VENDOR_ID'>廠商代號</Select.Option>
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
          rowKey='purchaseId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          scroll={{ x: 990 }}
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
