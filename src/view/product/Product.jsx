import React from 'react'
import { createHashHistory } from 'history'
import { Button, Col, Input, Row, Space, Table, Tooltip, Modal, Spin, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ListAddIcon,
  ListSearchIcon,
  ListEditIcon,
  ListDeleteIcon,
  ListOpenIcon,
  UtilCloseIcon,
  ListImageIcon
} from '../icon/Icon'
import { PageDrawer } from '../../component/PageDrawer'
import { getPaginationSetting } from '../../component/paginationSetting'
import { PhotoCarousel } from '../../component/PhotoCarousel'
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
        partId: '',
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
      detailVisible: false,
      photoVisible: false,
      photoLoading: true,
      photoList: []
    }
    this.getList()
  }

  getList = () => {
    const { search, pagination } = this.state
    const requestData = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      productId: search.productId,
      partId: search.partId,
      name: search.name,
      customCode1: search.customCode1
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
    const { pagination } = this.state
    pagination.total = 0
    pagination.current = 1
    this.setState({ loading: true, list: [], pagination }, () => this.getList())
  }

  getColumns = () => {
    const _this = this
    const { pagination } = this.state
    return [
      {
        dataIndex: 'productType',
        title: '',
        width: 6,
        fixed: 'left',
        className: 'product-table-type',
        render: (data) => {
          return data === 'REAL' ? (
            <span className='product-table-type-real' />
          ) : data === 'VIRTUAL' ? (
            <span className='product-table-type-virtual' />
          ) : (
            <span className='product-table-type-others' />
          )
        }
      },
      {
        dataIndex: 'seqNo',
        title: '??????',
        width: 70,
        fixed: 'left',
        render: (seqNo) => (
          <Space className='list-table-option'>
            <Tooltip title='??????'>
              <Button
                className='list-table-option-edit'
                size='small'
                onClick={_this.onDetailOpen.bind(_this, false, seqNo)}
              >
                <ListEditIcon />
              </Button>
            </Tooltip>
            <Tooltip title='??????'>
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
        title: '???',
        width: 80,
        align: 'center',
        fixed: 'left',
        render: (a, b, i) => (pagination.current - 1) * pagination.pageSize + i + 1
      },
      {
        title: '????????????',
        dataIndex: 'productId',
        width: 120,
        fixed: 'left'
      },
      {
        title: '????????????',
        dataIndex: 'kindShortName',
        width: 140
      },
      {
        title: '????????????',
        dataIndex: 'name',
        width: 300
      },
      {
        title: '??????',
        dataIndex: 'unit',
        width: 60,
        render: (data) => {
          const unit = StaticStorage.unitList.find((unit) => unit.unit === data)
          return unit ? unit.desc : data
        }
      },
      {
        title: '??????',
        dataIndex: 'norm',
        width: 180
      },
      {
        title: '????????????',
        dataIndex: 'productType',
        width: 300,
        render: (data, row) => {
          return data === 'REAL' ? (
            <div className='list-table-addition'>
              <Button type='link' onClick={_this.onPhotoOpen.bind(_this, row.seqNo)}>
                <span>??????????????????</span>
                <ListImageIcon />
              </Button>
            </div>
          ) : data === 'VIRTUAL' ? (
            <div className='list-table-addition'>
              <Button
                type='link'
                onClick={_this.onProductOpen.bind(_this, row.mappingProductSeqNo)}
              >
                <span>??????????????????: {row.mappingProductId}</span>
                <ListOpenIcon />
              </Button>
            </div>
          ) : null
        }
      }
    ]
  }

  handleDelete = (seqNo) => {
    Modal.confirm({
      title: '??????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      okText: '??????',
      cancelText: '??????',
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

  onDetailOpen = (detailCreate, detailSeqNo) =>
    this.setState({ detailCreate, detailSeqNo, detailVisible: true })
  onDetailClose = () => this.setState({ detailVisible: false })

  onPhotoOpen = (seqNo) => {
    this.setState(
      {
        photoVisible: true,
        photoLoading: true,
        photoList: []
      },
      () => {
        this.productAPI
          .getProductAdditionData(seqNo)
          .then((response) => {
            if (response.code === 0) {
              const photoList = []
              if (response.data.pic1Url) photoList.push(response.data.pic1Url)
              if (response.data.pic2Url) photoList.push(response.data.pic2Url)
              if (response.data.pic3Url) photoList.push(response.data.pic3Url)
              if (response.data.pic4Url) photoList.push(response.data.pic4Url)
              this.setState({ photoLoading: false, photoList })
            } else {
              message.error('??????????????????')
              this.setState({ photoVisible: false })
            }
          })
          .catch(() => {
            message.error('??????????????????')
            this.setState({ photoVisible: false })
          })
      }
    )
  }

  onProductOpen = (seqNo) => {
    window.open(`${window.location.href.split('#')[0]}#/Products/Detail/${seqNo}`)
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
                onClick={() => this.history.push('/Products/Add')}
                className='list-header-add'
              >
                ??????
              </Button>
            </Col>
            <Col>
              <Space>
                <Input
                  placeholder='????????????'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'productId')}
                  style={{ width: 100 }}
                />
                <Input
                  placeholder='????????????'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'partId')}
                  style={{ width: 100 }}
                />
                <Input
                  placeholder='?????????1'
                  allowClear={true}
                  onChange={this.onInputChange.bind(this, 'customCode1')}
                  style={{ width: 100 }}
                />
                <Input
                  placeholder='????????????'
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
          rowClassName={(row) =>
            row.productType === 'VIRTUAL'
              ? 'product-virtual'
              : row.productType === 'OTHERS'
              ? 'product-others'
              : ''
          }
          scroll={{ x: 1256 }}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
        <PageDrawer
          placement='bottom'
          closeIcon={<UtilCloseIcon />}
          title={this.state.detailCreate ? '????????????' : '??????????????????'}
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
        <Modal
          className='product-real-pic-modal'
          visible={this.state.photoVisible}
          title={null}
          footer={null}
          onCancel={() => this.setState({ photoVisible: false })}
        >
          <Spin spinning={this.state.photoLoading}>
            <PhotoCarousel picList={this.state.photoList} />
          </Spin>
        </Modal>
      </>
    )
  }
}
