import React from 'react'
import { Row, Col, Space, Button, DatePicker, Select, Input, Table } from 'antd'
import { createHashHistory } from 'history'
import moment from 'moment'
import { ListAddIcon, ListSearchIcon, PhotoViewIcon, ListBlockIcon, UtilCloseIcon } from '../icon/Icon'
import { PageDrawer } from '../../component/PageDrawer'
import { getPaginationSetting } from '../../component/paginationSetting'
import ReceiveDetail from './ReceiveDetail'
import ReceiveAPI from '../../model/api/receive'

export default class Receive extends React.Component {
  history = createHashHistory()
  receiveAPI = new ReceiveAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        date: [
          moment().startOf('month').startOf('day').format('YYYY-MM-DD'),
          moment().endOf('month').startOf('day').format('YYYY-MM-DD')
        ],
        id: undefined,
        keyword: ''
      },
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 50,
        position: ['bottomLeft']
      },
      detailId: 0,
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
      requestData.beginDate = search.date[0]
      requestData.endDate = search.date[1]
    }
    this.receiveAPI
      .getReceiveList(requestData)
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
        dataIndex: 'paymentReceiveId',
        title: '??????',
        width: 50,
        fixed: 'left',
        render: (paymentReceiveId) => (
          <Space className='list-table-option'>
            <Button
              className='list-table-option-print'
              size='small'
              onClick={_this.onDetailOpen.bind(_this, paymentReceiveId)}
            >
              <PhotoViewIcon />
            </Button>
          </Space>
        )
      },
      {
        title: '??????',
        dataIndex: 'activeFlag',
        width: 50,
        align: 'center',
        fixed: 'left',
        render: (flag) => {
          return flag === 'N' && <ListBlockIcon className='list-table-block' />
        }
      },
      {
        title: '???',
        width: 80,
        align: 'center',
        fixed: 'left',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '???????????????',
        dataIndex: 'paymentReceiveId',
        width: 140,
        fixed: 'left'
      },
      {
        title: '???????????????',
        dataIndex: 'paymentReceiveDate',
        width: 140,
        fixed: 'left'
      },
      {
        title: '????????????',
        dataIndex: 'customerId',
        width: 140,
        fixed: 'left'
      },
      {
        title: '????????????',
        dataIndex: 'customerName',
        width: 200
      },
      {
        title: '?????????????????????',
        dataIndex: 'salesAccountingDate',
        width: 140
      },
      {
        title: '??????',
        dataIndex: 'remark'
      },
      {
        title: '?????????',
        dataIndex: 'crName',
        width: 100
      },
      {
        title: '?????????',
        dataIndex: 'chName',
        width: 100
      }
    ]
  }

  onPageChange = (page, pageSize) => {
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ loading: true, list: [], pagination }, () => this.getList())
  }

  onDetailOpen = (detailId) => this.setState({ detailId, detailVisible: true })
  onDetailClose = (refresh) => {
    this.setState({ detailVisible: false }, () => {
      if (refresh) {
        this.setState({ loading: true }, () => this.getList())
      }
    })
  }

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
                  onClick={() => this.history.push('/Receive/Add')}
                  className='list-header-add'
                >
                  ??????
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
                  placeholder='????????????'
                  value={this.state.search.id}
                  allowClear={true}
                  onChange={this.onSelectChange}
                  style={{ width: 100 }}
                >
                  <Select.Option value='PAYMENT_RECEIVE_ID'>????????????</Select.Option>
                  <Select.Option value='CUSTOMER_ID'>????????????</Select.Option>
                  <Select.Option value='NOTE'>??????</Select.Option>
                </Select>
                <Input
                  value={this.state.search.keyword}
                  placeholder='????????????'
                  allowClear={true}
                  onChange={this.onInputChange}
                />
                <Button
                  type='primary'
                  icon={<ListSearchIcon />}
                  onClick={this.handleSearch}
                  className='list-header-search'
                >
                  ??????
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
        <Table
          className='list-table-wrapper'
          rowKey='seqNo'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          rowClassName={(row) => (row.activeFlag === 'N' ? 'receive-abort' : '')}
          scroll={{ x: 1340 }}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
        <PageDrawer
          placement='bottom'
          closeIcon={<UtilCloseIcon />}
          title={this.state.detailCreate ? '????????????' : '??????????????????'}
          visible={this.state.detailVisible}
          onClose={this.onDetailClose}
        >
          <ReceiveDetail
            createFlag={false}
            isDrawMode={true}
            drawModeVisible={this.state.detailVisible}
            paymentReceiveId={this.state.detailId}
            onClose={this.onDetailClose}
          />
        </PageDrawer>
      </>
    )
  }
}
