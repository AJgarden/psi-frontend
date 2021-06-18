import React from 'react'
import { Spin, Row, Col, Space, DatePicker, Select, Button, Table, Typography, message } from 'antd'
import CsvDownloader from 'react-csv-downloader'
import moment from 'moment'
import ReportAPI from '../../model/api/report'

export default class SaleReport extends React.Component {
  reportAPI = new ReportAPI()
  headers = [
    { id: 'customerId', displayName: '客戶代號' },
    { id: 'customerName', displayName: '客戶名稱' },
    { id: 'count', displayName: '筆數' },
    { id: 'totalAmount', displayName: '總金額' },
    { id: 'totalPayedAmount', displayName: '已付款金額' },
    { id: 'totalUnPayedAmount', displayName: '未付款金額' }
  ]

  constructor(props) {
    super(props)
    this.state = {
      inited: false,
      filter: {
        beginDate: moment().startOf('month').valueOf(),
        endDate: moment().endOf('month').valueOf(),
        customerIdBegin: undefined,
        customerIdEnd: undefined
      },
      customerList: [],
      loading: false,
      list: [],
      statistic: {
        count: 0,
        totalAmount: 0,
        totalPayedAmount: 0,
        totalUnPayedAmount: 0
      }
    }
    this.getCustomerList()
      .then(() => this.setState({ inited: true }))
      .catch(() => this.setState({ inited: true }))
  }

  getCustomerList = async () => {
    await new Promise((resolve, reject) => {
      this.reportAPI
        .getCustomerList()
        .then((response) => {
          if (response.code === 0) {
            const { filter } = this.state
            filter.customerIdBegin = response.data.list[0].customerId
            filter.customerIdEnd = response.data.list[response.data.list.length - 1].customerId
            this.setState({ customerList: response.data.list, filter }, () => resolve(true))
          } else {
            message.error(response.message)
            reject(false)
          }
        })
        .catch((error) => {
          message.error(error.data.message)
          reject(false)
        })
    })
    await new Promise((resolve, reject) => {
      const { filter } = this.state
      this.reportAPI
        .getSaleReport({
          beginDate: moment(filter.beginDate).format('YYYY-MM-DD'),
          endDate: moment(filter.endDate).format('YYYY-MM-DD'),
          customerIdBegin: filter.customerIdBegin,
          customerIdEnd: filter.customerIdEnd
        })
        .then((response) => {
          if (response.code === 0) {
            const statistic = {
              count: response.data.count,
              totalAmount: response.data.totalAmount,
              totalPayedAmount: response.data.totalPayedAmount,
              totalUnPayedAmount: response.data.totalUnPayedAmount
            }
            this.setState(
              {
                list: response.data.salesReportItemOutputs.map((row, index) => {
                  return {
                    ...row,
                    index
                  }
                }),
                statistic
              },
              () => resolve(true)
            )
          } else {
            message.error(response.message)
            reject(false)
          }
        })
        .catch((error) => {
          message.error(error.data.message)
          reject(false)
        })
    })
  }

  getStartCustomerOptions = () => {
    const { customerList, filter } = this.state
    const list = customerList.filter((customer) => {
      if (filter.customerIdEnd) {
        return customer.customerId < filter.customerIdEnd
      } else {
        return true
      }
    })
    return list.map((customer) => {
      return {
        label: `${customer.customerId} - ${customer.name}`,
        value: customer.customerId
      }
    })
  }
  getEndCustomerOptions = () => {
    const { customerList, filter } = this.state
    const list = customerList.filter((customer) => {
      if (filter.customerIdBegin) {
        return customer.customerId > filter.customerIdBegin
      } else {
        return true
      }
    })
    return list.map((customer) => {
      return {
        label: `${customer.customerId} - ${customer.name}`,
        value: customer.customerId
      }
    })
  }

  onDateChange = (dates) => {
    const { filter } = this.state
    filter.beginDate = moment(dates[0]).valueOf()
    filter.endDate = moment(dates[1]).valueOf()
    this.setState({ filter })
  }
  onCustomerChange = (key, value) => {
    const { filter } = this.state
    filter[key] = value
    this.setState({ filter })
  }

  getSearchDisabled = () => {
    const { filter } = this.state
    if (!filter.beginDate || !filter.endDate || !filter.customerIdBegin || !filter.customerIdEnd) {
      return true
    }
    return false
  }
  searchData = () => {
    this.setState({ loading: true }, () => {
      const { filter } = this.state
      this.reportAPI
        .getSaleReport({
          beginDate: moment(filter.beginDate).format('YYYY-MM-DD'),
          endDate: moment(filter.endDate).format('YYYY-MM-DD'),
          customerIdBegin: filter.customerIdBegin,
          customerIdEnd: filter.customerIdEnd
        })
        .then((response) => {
          if (response.code === 0) {
            const statistic = {
              count: response.data.count,
              totalAmount: response.data.totalAmount,
              totalPayedAmount: response.data.totalPayedAmount,
              totalUnPayedAmount: response.data.totalUnPayedAmount
            }
            this.setState({
              loading: false,
              list: response.data.salesReportItemOutputs.map((row, index) => {
                return {
                  ...row,
                  index
                }
              }),
              statistic
            })
          } else {
            message.error(response.message)
            this.setState({ loading: false })
          }
        })
        .catch((error) => {
          message.error(error.data.message)
          this.setState({ loading: false })
        })
    })
  }

  getColumns = () => [
    {
      dataIndex: 'index',
      title: '序',
      width: 60,
      fixed: 'left',
      align: 'center',
      render: (record) => record + 1
    },
    {
      dataIndex: 'customerId',
      title: '客戶代號',
      fixed: 'left',
      width: 140
    },
    {
      dataIndex: 'customerName',
      title: '客戶名稱'
    },
    {
      dataIndex: 'count',
      title: '筆數',
      width: 100,
      align: 'right',
      render: (record) => `${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      dataIndex: 'totalAmount',
      title: '總金額',
      width: 140,
      align: 'right',
      render: (record) => `$ ${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      dataIndex: 'totalPayedAmount',
      title: '已付款金額',
      width: 140,
      align: 'right',
      render: (record) => `$ ${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      dataIndex: 'totalUnPayedAmount',
      title: '未付款金額',
      width: 140,
      fixed: 'right',
      align: 'right',
      render: (record) => {
        return (
          <Typography.Text type='danger'>
            $ {`${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography.Text>
        )
      }
    }
  ]

  getSummary = () =>
    this.state.list.length > 0 ? (
      <Table.Summary.Row style={{ backgroundColor: '#edf6f9' }}>
        <Table.Summary.Cell />
        <Table.Summary.Cell />
        <Table.Summary.Cell />
        <Table.Summary.Cell align='right'>總金額:</Table.Summary.Cell>
        <Table.Summary.Cell align='right'>
          <Typography.Text type='success'>
            $ {`${this.state.statistic.totalAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography.Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align='right'>
          $ {`${this.state.statistic.totalPayedAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Table.Summary.Cell>
        <Table.Summary.Cell align='right'>
          <Typography.Text type='danger'>
            $ {`${this.state.statistic.totalUnPayedAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography.Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    ) : null

  getCsvData = () => {
    const { filter, list } = this.state
    const output = list.map((row) => {
      return {
        ...row,
        customerId: '[' + row.customerId + ']'
      }
    })
    output.unshift(
      {
        customerId: '起始日期',
        customerName: moment(filter.beginDate).format('YYYY-MM-DD'),
        count: '起始客戶代號',
        totalAmount: '[' + filter.customerIdBegin + ']'
      },
      {
        customerId: '結束日期',
        customerName: moment(filter.endDate).format('YYYY-MM-DD'),
        count: '結束客戶代號',
        totalAmount: '[' + filter.customerIdEnd + ']'
      },
      {},
      {
        customerId: '客戶代號',
        customerName: '客戶名稱',
        count: '筆數',
        totalAmount: '總金額',
        totalPayedAmount: '已付款金額',
        totalUnPayedAmount: '未付款金額'
      }
    )
    return output
  }
  getCsvFilename = () => {
    const { filter } = this.state
    return `銷貨單報表_${moment().format('YYYY-MM-DD_HH:mm')}_${moment(filter.beginDate).format(
      'YYYY-MM-DD'
    )}_${moment(filter.endDate).format('YYYY-MM-DD')}_${filter.customerIdBegin}_${
      filter.customerIdEnd
    }`
  }

  render() {
    return (
      <Spin spinning={!this.state.inited} size='large'>
        <div className='report-header'>
          <Row gutter={24}>
            <Col xs={24} sm={24} xl={12}>
              <div className='report-header-group'>
                <div className='report-header-group-title'>起始客戶代號</div>
                <div className='report-header-group-content'>
                  <Select
                    placeholder='選擇客戶代號'
                    value={this.state.filter.customerIdBegin}
                    options={this.getStartCustomerOptions()}
                    onChange={this.onCustomerChange.bind(this, 'customerIdBegin')}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} xl={12}>
              <div className='report-header-group'>
                <div className='report-header-group-title'>結束客戶代號</div>
                <div className='report-header-group-content'>
                  <Select
                    placeholder='選擇客戶代號'
                    value={this.state.filter.customerIdEnd}
                    options={this.getEndCustomerOptions()}
                    onChange={this.onCustomerChange.bind(this, 'customerIdEnd')}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} xl={12}>
              <div className='report-header-group'>
                <div className='report-header-group-title'>查詢日期</div>
                <div className='report-header-group-content'>
                  <DatePicker.RangePicker
                    value={[
                      this.state.filter.beginDate ? moment(this.state.filter.beginDate) : undefined,
                      this.state.filter.endDate ? moment(this.state.filter.endDate) : undefined
                    ]}
                    onChange={this.onDateChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} xl={12} style={{ textAlign: 'right ' }}>
              <Space>
                <Button
                  type='primary'
                  disabled={this.getSearchDisabled()}
                  onClick={this.searchData}
                >
                  搜尋
                </Button>
                <CsvDownloader
                  columns={this.headers}
                  datas={this.getCsvData()}
                  noHeader={true}
                  filename={this.getCsvFilename()}
                >
                  <Button
                    type='primary'
                    disabled={this.state.list.length === 0}
                    // onClick={this.onExport}
                  >
                    匯出CSV
                  </Button>
                </CsvDownloader>
              </Space>
            </Col>
          </Row>
        </div>
        <Table
          className='list-table-wrapper'
          rowKey='customerId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          summary={this.getSummary}
          scroll={{ x: 920 }}
          pagination={false}
        />
      </Spin>
    )
  }
}
