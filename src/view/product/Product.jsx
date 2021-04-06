import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Row, Space, Table, Tooltip, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ListAddIcon, ListSearchIcon, ListEditIcon, ListDeleteIcon, UtilCloseIcon } from '../icon/Icon'
import { PageDrawer } from '../../component/PageDrawer'
import { getPaginationSetting } from '../../component/paginationSetting'
import ProductDetail from './ProductDetail'
import StaticStorage from '../../model/storage/static'
import ProductAPI from '../../model/api/product'

export default class Product extends React.Component {
  history = createHashHistory()
  productAPI = new ProductAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      search: {
        productId: '',
        customCode1: '',
        name: ''
      },
      list: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 50,
        position: ['bottomLeft']
      },
      detailCreate: true,
      detailSeqNo: 0,
      detailVisible: false
    }
    this.getList()
  }

  getList = () => {
    const { search, pagination } = this.state
    const requestData = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      productId: `%${search.productId}%`,
      name: `%${search.name}%`,
      customCode1: `%${search.customCode1}%`
    }
    this.productAPI
      .getProductList(requestData)
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
    this.setState({ loading: true, list: [] }, () => this.getList())
  }

  getColumns = () => {
    const _this = this
    const { pagination } = this.state
    return [
      {
        dataIndex: 'seqNo',
        title: '執行',
        width: 50,
        render: (seqNo) => (
          <Space className='list-table-option'>
            <Tooltip title='編輯'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onDetailOpen.bind(_this, false, seqNo)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='刪除'>
              <Button
                className='list-table-option-delete'
                size='small'
                onClick={_this.handleDelete.bind(_this, seqNo)}
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
        title: '商品編號',
        dataIndex: 'productId'
      },
      {
        title: '車種名稱',
        dataIndex: 'kindShortName'
      },
      {
        title: '商品名稱',
        dataIndex: 'name'
      },
      {
        title: '單位',
        dataIndex: 'unit',
        render: (data) => {
          const unit = StaticStorage.unitList.find((unit) => unit.unit === data)
          return unit ? unit.desc : data
        }
      },
      {
        title: '規格',
        dataIndex: 'norm'
      },
      {
        title: '原廠料號',
        dataIndex: 'vendorProductId'
      },
      {
        title: '定價1',
        dataIndex: 'price1',
        align: 'right',
        render: (data) => {
          return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        title: '定價2',
        dataIndex: 'price2',
        align: 'right',
        render: (data) => {
          return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        title: '定價3',
        dataIndex: 'price3',
        align: 'right',
        render: (data) => {
          return `$ ${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      },
      {
        title: '安全量',
        align: 'right',
        dataIndex: 'safetyStock'
      },
      {
        title: '庫存地點',
        dataIndex: 'storingPlace'
      }
    ]
  }

  onEdit = (seqNo) => {
    console.log(seqNo)
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
    this.setState({ loading: true, list: [] }, () => this.getList())
  }

  onDetailOpen = (detailCreate, detailSeqNo) =>
    this.setState({ detailCreate, detailSeqNo, detailVisible: true })
  onDetailClose = () => this.setState({ detailVisible: false })

  render() {
    return (
      <>
        <div className='list-header'>
          <Row type='flex' justify='space-between'>
            <Col>
              <Button
                type='primary'
                icon={<ListAddIcon />}
                onClick={() => this.onDetailOpen(true, 0)}
                className='list-header-add'
              >
                新增
              </Button>
            </Col>
            <Col>
              <Space>
                <Input
                  placeholder='商品編號'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'productId')}
                  style={{ width: 100 }}
                />
                <Input
                  placeholder='自訂碼1'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'customCode1')}
                  style={{ width: 100 }}
                />
                <Input
                  placeholder='商品名稱'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'name')}
                  style={{ width: 140 }}
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
          rowKey='seqNo'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
        <PageDrawer
          width={480}
          placement='right'
          closeIcon={<UtilCloseIcon />}
          title={this.state.detailCreate ? '新增商品' : '編輯商品資料'}
          visible={this.state.detailVisible}
          onClose={this.onDetailClose}
        >
          <ProductDetail
            createFlag={this.state.detailCreate}
            isDrawMode={true}
            drawModeVisible={this.state.detailVisible}
            seqNo={this.state.detailSeqNo}
            onClose={this.onDetailClose}
          />
        </PageDrawer>
      </>
    )
  }
}