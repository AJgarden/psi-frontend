import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Row, Select, Space, Table, Tooltip, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, ListSearchIcon, ListEditIcon, ListDeleteIcon } from '../icon/Icon'
import EmployeeAPI from '../../model/api/employee'

export default class Customer extends React.Component {
  history = createHashHistory()
  employeeAPI = new EmployeeAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        id: 'EMPLOYEE_ID',
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
    this.employeeAPI
      .getEmployeeList(requestData)
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
        dataIndex: 'employeeId',
        title: '執行',
        width: 50,
        render: (employeeId) => (
          <Space className='list-table-option'>
            <Tooltip title='編輯'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onEdit.bind(_this, employeeId)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='刪除'>
              <Button
                className='list-table-option-delete'
                size='small'
                onClick={_this.handleDelete.bind(_this, employeeId)}
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
        title: '員工編號',
        dataIndex: 'employeeId'
      },
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '手機號碼',
        dataIndex: 'cellPhone'
      },
      {
        title: '市內電話',
        dataIndex: 'phone'
      }
    ]
  }

  onEdit = (employeeId) => {
    this.history.push(`/Basic/Employee/${employeeId}`)
  }

  handleDelete = (employeeId) => {
    Modal.confirm({
      title: '確定要刪除此筆資料嗎',
      icon: <ExclamationCircleOutlined />,
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        console.log('delete: ' + employeeId)
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
                onClick={() => this.history.push('/Basic/Employee/Add')}
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
                  <Select.Option value='EMPLOYEE_ID'>員工編號</Select.Option>
                  <Select.Option value='NAME'>姓名</Select.Option>
                </Select>
                <Input placeholder='搜尋內容' onChange={this.onInputChange} />
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
          rowKey='employeeId'
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
