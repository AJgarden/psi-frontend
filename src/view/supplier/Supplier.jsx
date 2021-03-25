import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Modal,
  Typography
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import SupplierAPI from '../../model/api/supplier'

class Supplier extends React.Component {
  supplierAPI = new SupplierAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        id: 'VENDOR_ID',
        keyword: ''
      },
      supplierList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        position: ['bottomLeft']
      }
    }
    this.getSupplierList()
  }

  getSupplierList = () => {
    const { search, pagination } = this.state
    const requestData = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      queryByEnum: search.id,
      queryKeyWord: search.keyword
    }
    this.supplierAPI
      .getSupplierList(requestData)
      .then((response) => {
        pagination.total = response.data.total
        this.setState({ loading: false, supplierList: response.data.list, pagination })
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
    this.setState({ loading: true }, () => this.getSupplierList())
  }

  getColumns = () => {
    return [
      {
        title: '執行',
        width: 50,
        render: (item) => (
          <Space>
            <Tooltip title='編輯'>
              <Link to='/Basic/Supplier/EditSupplier'>
                <Button type='primary' icon={<EditOutlined />} size='small' />
              </Link>
            </Tooltip>
            <Tooltip title='刪除'>
              <Button
                danger
                icon={<DeleteOutlined />}
                size='small'
                onClick={this.handleDelete.bind(this, item)}
              />
            </Tooltip>
          </Space>
        )
      },
      {
        title: '序',
        width: 30,
        render: (a, b, i) => i + 1
      },
      {
        title: '廠商代號',
        dataIndex: 'vendorId'
      },
      {
        title: '廠商簡稱',
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

  handleDelete = () => {}

  onPageChange = (page, pageSize) => {
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ loading: true }, () => this.getSupplierList())
  }

  render() {
    return (
      <>
        <div style={{ marginBottom: 10 }}>
          <Row type='flex' justify='space-between'>
            <Col>
              <Link to='/Basic/Supplier/AddSupplier'>
                <Button type='primary' icon={<PlusOutlined />}>
                  新增
                </Button>
              </Link>
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder='搜尋欄位'
                  value={this.state.search.id}
                  onChange={this.onSelectChange}
                >
                  <Select.Option value='VENDOR_ID'>廠商代號</Select.Option>
                  <Select.Option value='NAME'>廠商名稱</Select.Option>
                </Select>
                <Input placeholder='搜尋內容' onChange={this.onInputChange} />
                <Button type='primary' icon={<SearchOutlined />} onClick={this.handleSearch}>
                  查詢
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
        <Table
          rowKey='vendorId'
          size='small'
          bordered
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.supplierList}
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

export default Supplier
