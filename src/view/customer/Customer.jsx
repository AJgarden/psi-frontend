import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Row, Select, Space, Table, Tooltip, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, ListSearchIcon, ListEditIcon, ListDeleteIcon } from '../icon/Icon'
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
      queryKeyWord: `%${search.keyword}%`
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
    this.setState({ loading: true }, () => this.getList())
  }

  getColumns = () => {
    const _this = this
    const { pagination } = this.state
    return [
      {
        dataIndex: 'customerId',
        title: '執行',
        width: 50,
        render: (customerId) => (
          <Space className='list-table-option'>
            <Tooltip title='編輯'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onEdit.bind(_this, customerId)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='刪除'>
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
        title: '序',
        width: 30,
        align: 'center',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '客戶代號',
        dataIndex: 'customerId'
      },
      {
        title: '客戶簡稱',
        dataIndex: 'shortName'
      },
      {
        title: '聯絡人',
        dataIndex: 'contactPerson'
      },
      {
        title: '地址',
        dataIndex: 'address'
      },
      {
        title: '電話1',
        dataIndex: 'phone1'
      },
      {
        title: '傳真號碼',
        dataIndex: 'faxNumber'
      },
      {
        title: '行動電話',
        dataIndex: 'cellPhone'
      }
    ]
  }

  onEdit = (customerId) => {
    this.history.push(`/Basic/Customer/${customerId}`)
  }

  handleDelete = (customerId) => {
    Modal.confirm({
      title: '確定要刪除此筆資料嗎',
      icon: <ExclamationCircleOutlined />,
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        console.log('delete: ' + customerId)
      }
    })
  }

  onPageChange = (page, pageSize) => {
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ loading: true }, () => this.getList())
  }

  render() {
    return (
      <>
        <div className='' style={{ marginBottom: 10 }}>
          <Row type='flex' justify='space-between'>
            <Col>
              <Button
                type='primary'
                icon={<ListAddIcon />}
                onClick={() => this.history.push('/Basic/Customer/Add')}
                className='list-header-add'
              >
                新增
              </Button>
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder='搜尋欄位'
                  value={this.state.search.id}
                  onChange={this.onSelectChange}
                >
                  <Select.Option value='CUSTOMER_ID'>客戶代號</Select.Option>
                  <Select.Option value='NAME'>客戶名稱</Select.Option>
                </Select>
                <Input placeholder='搜尋內容' allowClear={true} onChange={this.onInputChange} />
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
          rowKey='customerId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          pagination={{
            ...this.state.pagination,
            showTotal: (total, range) => `${range[0]} - ${range[1]} 共 ${total} 筆`,
            showSizeChanger: true,
            onChange: this.onPageChange
          }}
        />
      </>
    )
  }
}
