import React from 'react'
import { Button, Empty } from 'antd'
import QRCode from 'react-qr-code'
import ProductAPI from '../../model/api/product'

export default class PrintCode extends React.Component {
  productAPI = new ProductAPI()

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      failed: false,
      data: {}
    }
    this.productAPI
      .getProductData(props.match.params.productSeqNo)
      .then((response) => {
        if (response.code === 0) {
          this.setState({ loaded: true, data: response.data })
        } else {
          this.setState({ loaded: true, failed: true })
        }
      })
      .catch(() => this.setState({ loaded: true, failed: true }))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.productSeqNo !== this.props.match.params.productSeqNo) {
      this.setState({ loaded: false, failed: false }, () => {
        this.productAPI
          .getProductData(this.props.match.params.productSeqNo)
          .then((response) => {
            if (response.code === 0) {
              this.setState({ loaded: true, data: response.data })
            } else {
              this.setState({ loaded: true, failed: true })
            }
          })
          .catch(() => this.setState({ loaded: true, failed: true }))
      })
    }
  }

  render() {
    return this.state.loaded ? (
      this.state.failed ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='查無此商品' />
      ) : (
        <div className='qrcode-print'>
          <div className={`qrcode-board qrcode-board-${this.props.match.params.size}`}>
            <div className='qrcode-board-id'>{this.state.data.productId}</div>
            <div className='qrcode-board-flex'>
              <div className='qrcode-board-code'>
                <QRCode
                  value={this.state.data.productId}
                  size={this.props.match.params.size === '29' ? 70 : 70}
                />
              </div>
              <div className='qrcode-board-detail'>
                <div className='qrcode-board-name'>{this.state.data.name}</div>
                <div className='qrcode-board-norm'>{this.state.data.norm !== '' && `(${this.state.data.norm})`}</div>
              </div>
            </div>
          </div>
          <div className='qrcode-noprint'>
            <Button type='primary' onClick={() => window.print()}>
              列印
            </Button>
          </div>
        </div>
      )
    ) : null
  }
}
