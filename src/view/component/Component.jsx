import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Row, Space, Table, Tooltip, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, ListSearchIcon, ListEditIcon, ListDeleteIcon } from '../icon/Icon'
import { getPaginationSetting } from '../../component/paginationSetting'
import ComponentAPI from '../../model/api/component'

export default class Component extends React.Component {
  history = createHashHistory()
  componentAPI = new ComponentAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        partId: '',
        name: ''
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
      partId: `%${search.partId}%`,
      name: `%${search.name}%`
    }
    this.componentAPI
      .getComponentList(requestData)
      .then((response) => {
        pagination.total = response.data.total
        this.setState({ loading: false, list: response.data.list, pagination })
      })
      .catch(() => this.setState({ loading: false }))
  }

  // search
  onInputChange = (key, e) => {
    const { search } = this.state
    search[key] = e.target.value
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
        dataIndex: 'partId',
        title: '執行',
        width: 50,
        render: (partId) => (
          <Space className='list-table-option'>
            <Tooltip title='編輯'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onEdit.bind(_this, partId)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='刪除'>
              <Button
                className='list-table-option-delete'
                size='small'
                onClick={_this.handleDelete.bind(_this, partId)}
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
        title: '零件代號',
        dataIndex: 'partId'
      },
      {
        title: '零件名稱',
        dataIndex: 'name'
      }
    ]
  }

  onEdit = (partId) => {
    this.history.push(`/Parts/Component/${partId}`)
  }

  handleDelete = (partId) => {
    Modal.confirm({
      title: '確定要刪除此筆資料嗎',
      icon: <ExclamationCircleOutlined />,
      okText: '確認',
      cancelText: '取消',
      onOk: () => {
        console.log('delete: ' + partId)
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
        <div className='list-header'>
          <Row type='flex' justify='space-between'>
            <Col>
              <Button
                type='primary'
                icon={<ListAddIcon />}
                onClick={() => this.history.push('/Parts/Component/Add')}
                className='list-header-add'
              >
                新增
              </Button>
            </Col>
            <Col>
              <Space>
                <Input
                  placeholder='搜尋零件代號'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'partId')}
                  style={{ width: 140 }}
                />
                <Input
                  placeholder='搜尋零件名稱'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'name')}
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
          rowKey='vendorId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
      </>
    )
  }
}