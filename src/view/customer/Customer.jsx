import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Row, Select, Space, Table, Tooltip, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, ListSearchIcon, ListEditIcon, ListDeleteIcon } from '../icon/Icon'
import { getPaginationSetting } from '../../component/paginationSetting'
import CustomerAPI from '../../model/api/customer'

export default class Customer extends React.Component {
  history = createHashHistory()
  customerAPI = new CustomerAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        id: 'CUSTOMER_ID',
        keyword: ''
      },
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        position: ['bottomLeft']
      }
    }
    this.getList()
  }

  getList = () => {
    const { search, pagination } = this.state
    const requestData = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      queryByEnum: search.id,
      queryKeyWord: search.keyword
    }
    this.customerAPI
      .getCustomerList(requestData)
      .then((response) => {
        pagination.total = response.data.total
        this.setState({ loading: false, list: response.data.list, pagination })
      })
      .catch(() => this.setState({ loading: false }))
  }

  // search
  onSelectChange = (value) => {
    const { search } = this.state
    search.id = value
    this.setState({ search })
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
        dataIndex: 'customerId',
        title: '??????',
        width: 70,
        fixed: 'left',
        render: (customerId) => (
          <Space className='list-table-option'>
            <Tooltip title='??????'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onEdit.bind(_this, customerId)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='??????'>
              <Button
                className='list-table-option-delete'
                size='small'
                onClick={_this.handleDelete.bind(_this, customerId)}
              >
                <ListDeleteIcon />
              </Button>
            </Tooltip>
          </Space>
        )
      },
      {
        title: '???',
        width: 80,
        align: 'center',
        fixed: 'left',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '????????????',
        dataIndex: 'customerId',
        fixed: 'left',
        width: 120
      },
      {
        title: '????????????',
        dataIndex: 'shortName',
        width: 240
      },
      {
        title: '?????????',
        dataIndex: 'contactPerson',
        width: 120
      },
      {
        title: '??????',
        dataIndex: 'address',
        width: 340
      },
      {
        title: '??????1',
        dataIndex: 'phone1',
        width: 120
      },
      {
        title: '????????????',
        dataIndex: 'faxNumber',
        width: 120
      },
      {
        title: '????????????',
        dataIndex: 'cellphone',
        width: 120
      }
    ]
  }

  onEdit = (customerId) => {
    this.history.push(`/Basic/Customer/${customerId}`)
  }

  handleDelete = (customerId) => {
    Modal.confirm({
      title: '??????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        console.log('delete: ' + customerId)
      }
    })
  }

  onPageChange = (page, pageSize) => {
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ loading: true, list: [], pagination }, () => this.getList())
  }

  render() {
    return (
      <>
        <div className='list-header'>
          <Row type='flex' justify='space-between'>
            <Col>
              <Button
                type='primary'
                icon={<ListAddIcon />}
                onClick={() => this.history.push('/Basic/Customer/Add')}
                className='list-header-add'
              >
                ??????
              </Button>
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder='????????????'
                  value={this.state.search.id}
                  onChange={this.onSelectChange}
                >
                  <Select.Option value='CUSTOMER_ID'>????????????</Select.Option>
                  <Select.Option value='NAME'>????????????</Select.Option>
                </Select>
                <Input placeholder='????????????' allowClear={true} onChange={this.onInputChange} />
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
          rowKey='customerId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          scroll={{ x: 1330 }}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
      </>
    )
  }
}
