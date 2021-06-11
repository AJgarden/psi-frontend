import React from 'react'
import { Modal, Button } from 'antd'
import SaleAPI from '../../model/api/sale'

export default class SalePrint extends React.Component {
  saleAPI = new SaleAPI()

  constructor(props) {
    super(props)
    this.state = {
      salesId: props.match.params.salesId,
      printData: []
    }
    this.getSalePrintData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.salesId !== this.props.salesId) {
      this.setState({ salesId: this.props.match.params.salesId }, () => this.getSalePrintData())
    }
  }

  getSalePrintData = () => {
    this.saleAPI.getPrintData(this.state.salesId).then((response) => {
      if (response.message) {
        Modal.error({
          title: response.message,
          okText: '關閉',
          onOk: () => window.close()
        })
      } else {
        this.setState({ printData: response })
        document.title = '列印銷貨單 - MOTOBUY PSI'
      }
    })
  }

  getPrice = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  generateNextNote = (page) => {
    const { printData } = this.state
    if (page + 1 < printData.length) {
      return (
        <tr>
          <td colSpan='3'></td>
          <td colSpan='2' style={{ textAlign: 'center' }}>
            ==== 接下頁 ====
          </td>
          <td colSpan='6'></td>
        </tr>
      )
    }
    return null
  }

  generateEmptyNote = (page) => {
    const { printData } = this.state
    if (page + 1 === printData.length) {
      if (printData[page].details.length < 8) {
        return (
          <tr>
            <td colSpan='3'></td>
            <td colSpan='2' style={{ textAlign: 'center' }}>
              ==== 以下空白 ====
            </td>
            <td colSpan='6'></td>
          </tr>
        )
      }
      return null
    }
    return null
  }

  generateSpecialNote = (page) => {
    const { printData } = this.state
    if (page + 1 === printData.length) {
      if (printData[page].specialNotes && printData[page].specialNotes.length > 0) {
        return printData[page].specialNotes.map((note, index) => (
          <tr key={`spnote-${index}`}>
            <td></td>
            <td colSpan='10'>{note}</td>
          </tr>
        ))
      }
      return null
    }
    return null
  }

  generateFoot = (page) => {
    const { printData } = this.state
    return (
      <div className='data-footer'>
        <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            <col width='16' />
            <col width='34' />
            <col width='102' />
            <col width='106' />
            <col width='132' />
            <col width='75' />
            <col width='56' />
            <col width='56' />
            <col width='68' />
            <col width='53' />
            <col />
          </colgroup>
          <tfoot>
            <tr>
              <td colSpan='2'></td>
              <td
                colSpan='2'
                style={{ fontSize: 15, lineHeight: '18px', verticalAlign: 'top', padding: '0 6px' }}
                dangerouslySetInnerHTML={{
                  __html: printData[page].note.replace('\n', '<br />')
                }}
              ></td>
              <td colSpan='2'></td>
              <td></td>
              <td
                colSpan='2'
                style={{
                  fontSize: 17,
                  textAlign: 'right',
                  verticalAlign: 'top',
                  padding: '6px 10px'
                }}
              >
                {page + 1 === printData.length ? this.getPrice(printData[page].totalAmount) : '--'}
              </td>
              <td
                colSpan='2'
                style={{
                  fontSize: 17,
                  textAlign: 'right',
                  verticalAlign: 'top',
                  padding: '6px 10px'
                }}
              >
                {printData[page].customerId}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  render() {
    return (
      <>
        <div className='print-btn'>
          <Button type='primary' onClick={() => window.print()}>
            列印
          </Button>
          <Button onClick={() => window.close()}>關閉視窗</Button>
        </div>
        {this.state.printData.map((data, index) => (
          <div key={index} className='print-area'>
            <div className='print-backward'>
              <div className='header'>
                <div className='header-left'>
                  <div>客戶寶號：</div>
                  <div>客戶電話：</div>
                  <div>客戶地址：</div>
                </div>
                <div className='header-right'>
                  <div>頁數：</div>
                  <div>日期：</div>
                  <div>單號：</div>
                </div>
              </div>
              <div className='table'>
                <div className='table-right'>送貨</div>
                <table className='table-table'>
                  <colgroup>
                    <col width='16' />
                    <col width='34' />
                    <col width='102' />
                    <col width='106' />
                    <col width='132' />
                    <col width='75' />
                    <col width='56' />
                    <col width='56' />
                    <col width='68' />
                    <col width='53' />
                    <col />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>序</th>
                      <th colSpan='2'>商品代號</th>
                      <th colSpan='2'>商品名稱</th>
                      <th>規格</th>
                      <th>數量</th>
                      <th>單價</th>
                      <th>金額</th>
                      <th>備註</th>
                      <th>顏色</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td colSpan='2'></td>
                      <td colSpan='2'></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan='2'>備註</th>
                      <td colSpan='2'></td>
                      <td colSpan='2'>正廠零件如不使用請即刻退回，並保持包裝完整。</td>
                      <th>總計</th>
                      <td colSpan='4'></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className='print-forward'>
              <div className='data-header'>
                <div className='data-header-left'>
                  <div>{data.customerInfo}</div>
                  <div>{data.customerPhone}</div>
                  <div>{data.customerAddress}</div>
                </div>
                <div className='data-header-right'>
                  <div>{data.page}</div>
                  <div>{data.accountDate}</div>
                  <div>{data.salesId}</div>
                </div>
              </div>
              <div className='data-table'>
                <table>
                  <colgroup>
                    <col width='16' />
                    <col width='34' />
                    <col width='102' />
                    <col width='106' />
                    <col width='132' />
                    <col width='75' />
                    <col width='56' />
                    <col width='56' />
                    <col width='68' />
                    <col width='53' />
                    <col />
                  </colgroup>
                  <tbody>
                    {data.details.map((record, row) => (
                      <tr key={`table-${index}-${row}`} className='row'>
                        <td></td>
                        <td colSpan='2'>
                          <div>{record.productId}</div>
                        </td>
                        <td colSpan='2'>
                          <div>{record.product_desc}</div>
                        </td>
                        <td>
                          <div>{record.norm}</div>
                        </td>
                        <td>
                          <div>{record.quantity}</div>
                        </td>
                        <td>
                          <div>{this.getPrice(record.price)}</div>
                        </td>
                        <td>
                          <div>{this.getPrice(record.amount)}</div>
                        </td>
                        <td>
                          <div>{record.remark}</div>
                        </td>
                        <td>
                          <div>{record.color}</div>
                        </td>
                      </tr>
                    ))}
                    {this.generateNextNote(index)}
                    {this.generateEmptyNote(index)}
                    {this.generateSpecialNote(index)}
                  </tbody>
                </table>
              </div>
              {this.generateFoot(index)}
            </div>
          </div>
        ))}
      </>
    )
  }
}
