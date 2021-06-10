import React from 'react'
import { Modal, Spin, Row, Col, message, Empty } from 'antd'
import ProductAPI from '../../model/api/product'
import StaticStorage from '../../model/storage/static'

export default class ViewProductModal extends React.Component {
  productAPI = new ProductAPI()

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: {},
      additionData: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setState({ loading: true, data: {}, additionData: {} }, () => {
        this.productAPI
          .getProductInfo(this.props.seqNo)
          .then((response) => {
            if (response.code === 0) {
              this.setState({ loading: false, data: response.data })
            } else {
              message.error('取得商品資料失敗!')
              this.props.onClose()
            }
          })
          .catch(() => {
            message.error('取得商品資料失敗!')
            this.props.onClose()
          })
      })
    }
  }

  getUnit = () => {
    const { data } = this.state
    const unit = StaticStorage.unitList.find((unit) => unit.unit === data.unit)
    return unit ? unit.desc : data.unit
  }
  getPrice = () => {
    const {
      data: { price1, price2, price3 }
    } = this.state
    return `$ ${price1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} / $ ${price2
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} / $ ${price3
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }
  getVolumn = (data) => {
    return data === null ? '' : data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  render() {
    return (
      <Modal
        className='view-product-modal'
        title='檢視商品'
        visible={this.props.visible}
        destroyOnClose={true}
        onCancel={this.props.onClose}
        footer={null}
      >
        <Spin spinning={this.state.loading} size='large'>
          <div style={{ minHeight: 200 }}>
            {this.state.data.productId && (
              <>
                <table className='view-product-table'>
                  <tr>
                    <th>商品編號</th>
                    <th>車種</th>
                    <th>單位</th>
                    <th>規格</th>
                    <th>商品名稱</th>
                  </tr>
                  <tr>
                    <td>{this.state.data.productId}</td>
                    <td>{this.state.data.kindShortName}</td>
                    <td>{this.getUnit()}</td>
                    <td>{this.state.data.norm}</td>
                    <td>{this.state.data.name}</td>
                  </tr>
                </table>
                <table className='view-product-table'>
                  <tr>
                    <th>定價</th>
                    <th>庫存地點</th>
                    <th>庫存量</th>
                    <th>安全量</th>
                    <th>原廠料號</th>
                  </tr>
                  <tr>
                    <td>{this.getPrice()}</td>
                    <td>{this.state.data.storingPlace}</td>
                    <td>{this.state.data.inventory}</td>
                    <td>{this.state.data.safetyStock}</td>
                    <td>{this.state.data.vendorProductId}</td>
                  </tr>
                </table>
                <table className='view-product-table addition'>
                  <tr>
                    <th>長 (cm)</th>
                    <th>寬 (cm)</th>
                    <th>高 (cm)</th>
                    <th>重量 (g)</th>
                  </tr>
                  <tr>
                    <td>{this.getVolumn(this.state.data.length)}</td>
                    <td>{this.getVolumn(this.state.data.width)}</td>
                    <td>{this.getVolumn(this.state.data.height)}</td>
                    <td>{this.getVolumn(this.state.data.weight)}</td>
                  </tr>
                </table>
                <table className='view-product-table addition'>
                  <tr>
                    <td>
                      <div>
                        {!this.state.data.pic1Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img src={this.state.data.pic1Url} alt={this.state.data.name} />
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {!this.state.data.pic2Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img src={this.state.data.pic2Url} alt={this.state.data.name} />
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {!this.state.data.pic3Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img src={this.state.data.pic3Url} alt={this.state.data.name} />
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        {!this.state.data.pic4Url ? (
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='尚未上傳' />
                        ) : (
                          <img src={this.state.data.pic4Url} alt={this.state.data.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                </table>
              </>
            )}
          </div>
        </Spin>
      </Modal>
    )
  }
}
