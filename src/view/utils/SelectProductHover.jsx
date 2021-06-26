import React from 'react'
import moment from 'moment'
import { Spin, Table, Button, Empty } from 'antd'
import { ProductSelectIcon, ProductNextIcon } from '../icon/Icon'
import ProductAPI from '../../model/api/product'

export default class SelectProductHover extends React.Component {
  productAPI = new ProductAPI()
  searchTime = 0
  refList = []

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      column: {},
      list: [],
      selectOrder: -1,
      isFinished: false
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keydownListen)
    this.openEvent()
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.keydownListen)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keyword !== this.props.keyword) {
      this.openEvent()
    }
  }

  openEvent = () => {
    if (this.props.keyword !== '') {
      this.searchTime = moment().valueOf()
      this.setState({ loading: true }, () => {
        setTimeout(() => {
          if (moment().valueOf() - this.searchTime >= 1000 && this.props.keyword !== '') {
            this.getSearchList()
          }
        }, 1000)
      })
    } else {
      this.searchTime = moment().valueOf()
      this.setState({ loading: false, column: {}, list: [], selectOrder: 0, isFinished: false })
    }
  }

  keydownListen = (event) => {
    if (!this.state.loading) {
      if (event.keyCode === 38 || event.keyCode === 40) {
        const { list } = this.state
        if (list.length > 0) {
          let selectOrder = 0
          if (event.keyCode === 38) {
            // up
            selectOrder =
              this.state.selectOrder === 0 ? list.length - 1 : this.state.selectOrder - 1
          } else if (event.keyCode === 40) {
            // down
            selectOrder =
              this.state.selectOrder + 1 === list.length ? 0 : this.state.selectOrder + 1
          }
          this.setState({ selectOrder }, () => {
            if (this.refList[selectOrder]) this.refList[selectOrder].scrollIntoView(true)
          })
        }
      } else if (event.keyCode === 13) {
        const { list, selectOrder } = this.state
        if (list[selectOrder]) {
          if (list[selectOrder].finished) {
            this.props.onSearchSelect(
              this.props.detailNo,
              `${list[selectOrder].data}|${list[selectOrder].productSeqNo}`,
              true
            )
          } else {
            this.props.onSearchSelect(
              this.props.detailNo,
              list[selectOrder].data,
              false
            )
          }
        }
      }
    }
  }

  getSearchList = () => {
    this.productAPI
      .queryProduct(this.props.type === 'purchase', this.props.keyword)
      .then((response) => {
        if (this.props.keyword !== '') {
          this.refList = new Array(response.data.infos.length)
          this.setState({
            loading: false,
            column: response.data.descs,
            list: response.data.infos,
            selectOrder: response.data.infos.findIndex((item) => item.data === this.props.keyword),
            isFinished: response.data.infos.length > 0 && response.data.infos[0].finished
          })
        }
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
          obj.width = 140
          obj.render = (a, b, i) => (
            <>
              <div ref={(target) => (this.refList[i] = target)} />
              {a}
            </>
          )
        } else {
          obj.width = 140
        }
        return obj
      })
    // output.push({
    //   dataIndex: 'data',
    //   title: '選取',
    //   fixed: 'right',
    //   width: 60,
    //   render: (data, row) => {
    //     return row.finished ? (
    //       <Button
    //         size='small'
    //         className='purchase-product-modal-select'
    //         onClick={_this.selectProduct.bind(_this, row)}
    //       >
    //         <ProductSelectIcon />
    //       </Button>
    //     ) : (
    //       <Button
    //         size='small'
    //         className='purchase-product-modal-next'
    //         onClick={_this.selectPart.bind(_this, data)}
    //       >
    //         <ProductNextIcon />
    //       </Button>
    //     )
    //   }
    // })
    return output
  }

  getClassName = (row, index) => {
    return index === this.state.selectOrder ? 'selected' : ''
  }

  selectPart = (value) => {
    this.setState({ loading: true, value }, () => this.getSearchList())
  }
  selectProduct = (product) => {
    this.setState({ value: product.data }, () => {
      this.onSelect(product)
    })
  }

  onSelect = (product) => {
    this.props.onSelect(this.props.detailNo, product)
  }

  render() {
    return (
      <>
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
                rowClassName={this.getClassName}
                pagination={false}
                scroll={{ y: 400 }}
              />
            ) : (
              <Empty description='查無符合條件的商品' />
            )}
          </Spin>
        </div>
      </>
    )
  }
}
