import React from 'react'
import { Button, Card, Row, Col, Select, Radio } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import QRCode from 'react-qr-code'
import moment from 'moment'
import PrintComponents from 'react-print-components'
import { FormItem } from '../../component/FormItem'
import ProductAPI from '../../model/api/product'

export default class ProductCode extends React.Component {
  productAPI = new ProductAPI()
  searchTime = 0

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      searchLoading: false,
      productList: [],
      product: {},
      size: '29'
    }
  }

  getProductList = async () => {
    await new Promise((resolve) => {
      this.productAPI.queryProduct(true, this.state.search).then((response) => {
        this.setState({ productList: response.data.infos }, () => resolve(true))
      })
    })
  }

  onSearch = (search) => {
    this.searchTime = moment().valueOf()
    this.setState({ search }, () => {
      setTimeout(() => {
        if (moment().valueOf() - this.searchTime >= 1000 && this.state.search.length > 2) {
          this.getProductList()
        }
      }, 1000)
    })
  }

  onSelect = (value) => {
    const { productList } = this.state
    const product = productList.find((product) => product.data === value)
    this.setState({ search: product.data, product, productList: [product] })
  }

  onPrint = () => {
    const printContent = document.getElementById('qrcode-print')
    const docPrint = window.open(
      '',
      '',
      'left=0, top=0, width=1200, height=900, toolbar=0, scrollbars=0, status=0'
    )
    docPrint.document.write(printContent.innerHTML)
    docPrint.document.close()
    docPrint.focus()
    docPrint.print()
    docPrint.close()
  }

  render() {
    return (
      <>
        <Card className='form-detail-card'>
          <Row gutter={[24, 24]}>
            <Col span={24} xl={12}>
              <FormItem
                title='選擇商品'
                content={
                  <Select
                    showSearch={true}
                    showArrow={false}
                    notFoundContent={null}
                    value={this.state.productId}
                    options={this.state.productList.map((product) => {
                      return {
                        label: `${product.desc1} (${product.desc2}/${product.desc3})`,
                        value: product.desc1
                      }
                    })}
                    onSearch={this.onSearch}
                    onChange={this.onSelect}
                    style={{ width: '100%' }}
                  />
                }
              />
            </Col>
            <Col span={24} xl={12}>
              <FormItem
                title='標籤帶尺寸'
                content={
                  <div style={{ display: 'flex', height: 32, alignItems: 'center' }}>
                    <Radio.Group value={this.state.size} onChange={(e) => this.setState({ size: e.target.value })}>
                      <Radio value='29'>29*62mm</Radio>
                    </Radio.Group>
                  </div>
                }
              />
            </Col>
          </Row>
        </Card>
        {this.state.product.data && (
          <Card className='form-detail-card' style={{ textAlign: 'center' }}>
            <iframe
              title='列印商品標籤'
              className={`qrcode-frame qrcode-frame-${this.state.size}`}
              src={`${window.location.href.split('#')[0]}#/QRCode/Print/${this.state.size}/${
                this.state.product.productSeqNo
              }`}
            />
          </Card>
        )}
      </>
    )
  }
}
