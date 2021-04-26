import React from 'react'
import { createHashHistory } from 'history'
import { Row, Col, Space, Button, Input, InputNumber, Spin, Select, Table } from 'antd'
import { ListAddIcon, ListSearchIcon } from '../icon/Icon'
import { getPaginationSetting } from '../../component/paginationSetting'
import ProductAPI from '../../model/api/product'
import moment from 'moment'

export default class ProductQuickEdit extends React.Component {
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
      mappingSearch: {}
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
        const mappingSearch = {}
        response.data.list.forEach((product) => {
          if (product.productType === 'VIRTUAL') {
            mappingSearch[product.seqNo] = {
              loading: false,
              value: product.mappingProductId,
              search: '',
              searchTime: 0,
              list: [],
              select: {}
            }
          }
        })
        if (Object.keys(mappingSearch).length > 0) {
          this.setState({ list: response.data.list, pagination, mappingSearch }, () =>
            this.getMappingProducts(mappingSearch).then((mappingSearch) =>
              this.setState({ loading: false, mappingSearch })
            )
          )
        } else {
          this.setState({ loading: false, list: response.data.list, pagination, mappingSearch: {} })
        }
      })
      .catch(() => this.setState({ loading: false }))
  }
  getMappingProducts = async (mappingSearch) => {
    const seqNos = Object.keys(mappingSearch)
    for (const seqNo of seqNos) {
      await new Promise((resolve) => {
        this.productAPI.searchProductMapping(true, mappingSearch[seqNo].value).then((response) => {
          mappingSearch[seqNo].list = response.data
          mappingSearch[seqNo].select = response.data[0]
          resolve(true)
        })
      })
    }
    return Promise.resolve(mappingSearch)
  }

  // search
  onInputChange = (key, e) => {
    const { search } = this.state
    search[key] = e.target.value
    this.setState({ search })
  }
  handleSearch = () => {
    const { pagination } = this.state
    pagination.current = 1
    this.setState({ loading: true, list: [], pagination, mappingSearch: {} }, () => this.getList())
  }

  getColumns = () => {
    const _this = this
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
        dataIndex: 'productId',
        title: '商品代號',
        width: 120,
        fixed: 'left'
      },
      {
        dataIndex: 'kindShortName',
        title: '車種簡稱',
        width: 140,
        fixed: 'left'
      },
      {
        dataIndex: 'name',
        title: '商品名稱',
        width: 300,
        fixed: 'left',
        render: (data, row) => {
          return (
            <Input
              value={data}
              onChange={_this.onProductInputChange.bind(_this, row.seqNo, 'name')}
            />
          )
        }
      },
      {
        dataIndex: 'norm',
        title: '規格',
        width: 120,
        render: (data, row) => {
          return (
            row.productType !== 'VIRTUAL' && (
              <Input
                value={data}
                onChange={_this.onProductInputChange.bind(_this, row.seqNo, 'norm')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'price1',
        title: '定價1',
        width: 120,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <InputNumber
                value={data}
                min={0}
                max={99999999}
                step={1}
                onChange={_this.onProductValueChange.bind(_this, row.seqNo, 'price1')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'price2',
        title: '定價2',
        width: 120,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <InputNumber
                value={data}
                min={0}
                max={99999999}
                step={1}
                onChange={_this.onProductValueChange.bind(_this, row.seqNo, 'price2')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'price3',
        title: '定價3',
        width: 120,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <InputNumber
                value={data}
                min={0}
                max={99999999}
                step={1}
                onChange={_this.onProductValueChange.bind(_this, row.seqNo, 'price3')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'vendorProductId',
        title: '原廠料號',
        width: 200,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <Input
                value={data}
                onChange={_this.onProductInputChange.bind(_this, row.seqNo, 'vendorProductId')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'safetyStock',
        title: '安全量',
        width: 120,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <InputNumber
                value={data}
                min={0}
                max={999999}
                step={1}
                onChange={_this.onProductValueChange.bind(_this, row.seqNo, 'safetyStock')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'inventory',
        title: '庫存量',
        width: 120,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <InputNumber
                value={data}
                min={0}
                max={999999}
                step={1}
                onChange={_this.onProductValueChange.bind(_this, row.seqNo, 'inventory')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'storingPlace',
        title: '庫存地點',
        width: 200,
        render: (data, row) => {
          return (
            row.productType === 'REAL' && (
              <Input
                value={data}
                onChange={_this.onProductInputChange.bind(_this, row.seqNo, 'storingPlace')}
              />
            )
          )
        }
      },
      {
        dataIndex: 'note',
        title: '備註',
        width: 300,
        render: (data, row) => {
          return (
            <Input.TextArea
              value={data}
              autoSize={{ minRows: 1, maxRows: 1 }}
              onChange={_this.onProductInputChange.bind(_this, row.seqNo, 'note')}
            />
          )
        }
      },
      {
        dataIndex: 'mappingProductId',
        title: '對應料號',
        width: 420,
        render: (data, row) => {
          if (row.productType === 'VIRTUAL') {
            const product = _this.state.mappingSearch[row.seqNo]
            return (
              product && (
                <Spin spinning={product.loading}>
                  <Select
                    showSearch={true}
                    showArrow={false}
                    value={product.value}
                    searchValue={product.search}
                    onSearch={_this.onMappingSearch.bind(_this, row.seqNo)}
                    onSelect={_this.onMappingSelect.bind(_this, row.seqNo)}
                    optionFilterProp='children'
                    style={{ width: '100%' }}
                    notFoundContent={null}
                    className='product-search'
                  >
                    {product.list.map((product) => (
                      <Select.Option key={product.data} value={product.data}>
                        {_this.getMappingProductDisplay(product)}
                      </Select.Option>
                    ))}
                  </Select>
                </Spin>
                // <Input
                //   value={data}
                //   onChange={_this.onProductInputChange.bind(_this, row.seqNo, 'mappingProductId')}
                // />
              )
            )
          }
          return null
        }
      }
    ]
  }

  onProductInputChange = (seqNo, key, event) => {
    const { list } = this.state
    const product = list.find((product) => product.seqNo === seqNo)
    if (product) {
      product[key] = event.target.value
      this.setState({ list }, () => this.updateProduct(product))
    }
  }

  onProductValueChange = (seqNo, key, value) => {
    const { list } = this.state
    const product = list.find((product) => product.seqNo === seqNo)
    if (product) {
      product[key] = value
      this.setState({ list }, () => this.updateProduct(product))
    }
  }

  // mapping product search & select
  getMappingProductDisplay = (product) => {
    let display = product.desc1
    if (product.desc2 || product.desc3 || product.desc4 || product.desc5) {
      let additionDisplay = ''
      additionDisplay += product.desc2 ? product.desc2 : ''
      additionDisplay += product.desc3
        ? additionDisplay !== ''
          ? `, ${product.desc3}`
          : product.desc3
        : ''
      additionDisplay += product.desc4
        ? additionDisplay !== ''
          ? `, ${product.desc4}`
          : product.desc4
        : ''
      additionDisplay += product.desc5
        ? additionDisplay !== ''
          ? `, ${product.desc5}`
          : product.desc5
        : ''
      display += ` [${additionDisplay}]`
    }
    return display
  }
  onMappingSearch = (seqNo, value) => {
    const { mappingSearch } = this.state
    mappingSearch[seqNo].search = value
    mappingSearch[seqNo].searchTime = moment().valueOf()
    this.setState({ mappingSearch }, () => {
      setTimeout(() => {
        if (moment().valueOf() - mappingSearch[seqNo].searchTime >= 1000 && value !== '') {
          mappingSearch[seqNo].loading = true
          this.setState({ mappingSearch }, () => {
            this.productAPI
              .searchProductMapping(true, value)
              .then((response) => {
                mappingSearch[seqNo].loading = false
                mappingSearch[seqNo].list = response.data
                this.setState({ mappingSearch })
              })
              .catch(() => {
                mappingSearch[seqNo].loading = false
                this.setState({ mappingSearch })
              })
          })
        } else if (value === '') {
          if (mappingSearch[seqNo].value !== '') {
            mappingSearch[seqNo].list = [mappingSearch[seqNo].select]
          } else {
            mappingSearch[seqNo].list = []
          }
          this.setState({ mappingSearch })
        }
      }, 1000)
    })
  }
  onMappingSelect = (seqNo, value) => {
    const { list, mappingSearch } = this.state
    const product = mappingSearch[seqNo].list.find((product) => product.data === value)
    if (product) {
      const row = list.find((row) => row.seqNo === seqNo)
      if (product.finished) {
        mappingSearch[seqNo].search = ''
        mappingSearch[seqNo].value = product.data
        mappingSearch[seqNo].list = [product]
        mappingSearch[seqNo].select = product
        row.mappingProductId = product.data
        row.mappingProductSeqNo = product.productSeqNo
        this.setState({ list, mappingSearch }, () => this.updateProduct(row))
      } else {
        mappingSearch[seqNo].search = value
        mappingSearch[seqNo].value = product.data
        mappingSearch[seqNo].list = [product]
        mappingSearch[seqNo].select = product
        row.mappingProductId = product.data
        row.mappingProductSeqNo = null
        this.setState({ list, mappingSearch }, () => {
          this.updateProduct(row)
        })
      }
    }
  }

  updateProduct = (product) => {
    this.productAPI.updateProductData(product)
  }

  onPageChange = (page, pageSize) => {
    const { pagination } = this.state
    pagination.current = page
    pagination.pageSize = pageSize
    this.setState({ loading: true, list: [], pagination, mappingSearch: {} }, () => this.getList())
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
          rowClassName={(row) =>
            row.productType === 'VIRTUAL'
              ? 'product-virtual'
              : row.productType === 'OTHERS'
              ? 'product-others'
              : ''
          }
          scroll={{ x: 2400 }}
          pagination={getPaginationSetting(this.state.pagination, this.onPageChange)}
        />
      </>
    )
  }
}
