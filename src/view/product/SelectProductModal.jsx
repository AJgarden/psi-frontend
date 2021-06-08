import React from 'react'
import { Modal, Button, Input, Spin, Table, Empty } from 'antd'
import moment from 'moment'
import { ProductSelectIcon, ProductNextIcon } from '../icon/Icon'
import ProductAPI from '../../model/api/product'

export default class SelectProductModal extends React.Component {
  productAPI = new ProductAPI()
  searchTime = 0

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      value: '',
      isFinished: false,
      column: {},
      list: [],
      canSave: false
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setState(
        { loading: this.props.value !== '', value: this.props.value, list: [], canSave: false },
        () => {
          if (this.props.value) {
            this.getSearchList()
          }
        }
      )
    }
  }

  getSearchList = () => {
    this.productAPI
      .queryProduct(true, this.state.value)
      .then((response) => {
        this.setState({
          loading: false,
          column: response.data.descs,
          list: response.data.infos,
          isFinished: response.data.length > 0 && response.data[0].finished
        })
      })
  }

  onSearchChange = (event) => {
    this.searchTime = moment().valueOf()
    this.setState({ loading: true, value: event.target.value }, () => {
      setTimeout(() => {
        if (moment().valueOf() - this.searchTime >= 1000) {
          this.getSearchList()
        }
      }, 1000)
    })
  }

  getColumns = () => {
    const { column } = this.state
    const _this = this
    const output = Object.keys(column)
      .filter((key) => key !== 'data' && key !== 'productSeqNo')
      .map((key) => {
        const obj = {
          dataIndex: key,
          title: column[key]
        }
        if (key === 'desc1') {
          obj.fixed = 'left'
          obj.width = 200
        }
        return obj
      })
    output.push({
      dataIndex: 'data',
      title: '選取',
      fixed: 'right',
      width: 60,
      render: (data, row) => {
        return row.finished ? (
          <Button
            size='small'
            className='purchase-product-modal-select'
            onClick={() => _this.props.onSelect(row)}
          >
            <ProductSelectIcon />
          </Button>
        ) : (
          <Button
            size='small'
            className='purchase-product-modal-next'
            onClick={_this.selectPart.bind(_this, data)}
          >
            <ProductNextIcon />
          </Button>
        )
      }
    })
    return output
  }

  selectPart = (value) => {
    this.setState({ loading: true, value }, () => this.getSearchList())
  }
  selectProduct = (product) => {
    this.setState({ value: product.data }, () => {
      this.props.onSelect(product)
    })
  }

  render() {
    return (
      <Modal
        className='purchase-product-modal'
        title='尋找商品'
        visible={this.props.visible}
        destroyOnClose={true}
        onCancel={this.props.onClose}
        footer={[
          <Button key='close' onClick={this.props.onClose}>
            關閉
          </Button>
        ]}
      >
        <div className='purchase-product-modal-search'>
          <Input
            placeholder='請輸入代碼開始尋找'
            value={this.state.value}
            onChange={this.onSearchChange}
          />
        </div>
        <div className='purchase-product-modal-result'>
          <Spin spinning={this.state.loading}>
            {this.state.list.length > 0 ? (
              <Table
                rowKey='data'
                columns={this.getColumns()}
                dataSource={this.state.list}
                loading={this.state.loading}
                bordered={true}
                size='small'
                pagination={false}
                scroll={{ y: 400 }}
              />
            ) : (
              <Empty description='查無符合條件的商品' />
            )}
          </Spin>
        </div>
      </Modal>
    )
  }
}
