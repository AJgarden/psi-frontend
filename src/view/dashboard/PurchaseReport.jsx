import React from 'react'
import { Spin, Row, Col, Space, DatePicker, Select, Button, Table, Typography, message } from 'antd'
import CsvDownloader from 'react-csv-downloader'
import moment from 'moment'
import ReportAPI from '../../model/api/report'

export default class PurchaseReport extends React.Component {
  reportAPI = new ReportAPI()
  headers = [
    { id: 'vendorId', displayName: '廠商代號' },
    { id: 'vendorName', displayName: '廠商名稱' },
    { id: 'count', displayName: '筆數' },
    { id: 'totalAmount', displayName: '進貨金額' }
  ]

  constructor(props) {
    super(props)
    this.state = {
      inited: false,
      filter: {
        beginDate: moment().startOf('month').valueOf(),
        endDate: moment().endOf('month').valueOf(),
        vendorIdBegin: undefined,
        vendorIdEnd: undefined
      },
      vendorList: [],
      loading: false,
      list: [],
      statistic: {
        count: 0,
        totalAmount: 0
      }
    }
    this.getVendorList()
      .then(() => this.setState({ inited: true }))
      .catch(() => this.setState({ inited: true }))
  }

  getVendorList = async () => {
    await new Promise((resolve, reject) => {
      this.reportAPI
        .getVendorList()
        .then((response) => {
          if (response.code === 0) {
            const { filter } = this.state
            filter.vendorIdBegin = response.data.list[0].vendorId
            filter.vendorIdEnd = response.data.list[response.data.list.length - 1].vendorId
            this.setState({ vendorList: response.data.list, filter }, () => resolve(true))
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
        .getPurchaseReport({
          beginDate: moment(filter.beginDate).format('YYYY-MM-DD'),
          endDate: moment(filter.endDate).format('YYYY-MM-DD'),
          vendorIdBegin: filter.vendorIdBegin,
          vendorIdEnd: filter.vendorIdEnd
        })
        .then((response) => {
          if (response.code === 0) {
            const statistic = {
              count: response.data.count,
              totalAmount: response.data.totalAmount
            }
            this.setState(
              {
                list: response.data.purchaseReportItemOutputs.map((row, index) => {
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

  getStartVendorOptions = () => {
    const { vendorList, filter } = this.state
    const list = vendorList.filter((vendor) => {
      if (filter.vendorIdEnd) {
        return vendor.vendorId < filter.vendorIdEnd
      } else {
        return true
      }
    })
    return list.map((vendor) => {
      return {
        label: `${vendor.vendorId} - ${vendor.name}`,
        value: vendor.vendorId
      }
    })
  }
  getEndVendorOptions = () => {
    const { vendorList, filter } = this.state
    const list = vendorList.filter((vendor) => {
      if (filter.vendorIdBegin) {
        return vendor.vendorId > filter.vendorIdBegin
      } else {
        return true
      }
    })
    return list.map((vendor) => {
      return {
        label: `${vendor.vendorId} - ${vendor.name}`,
        value: vendor.vendorId
      }
    })
  }

  onDateChange = (dates) => {
    const { filter } = this.state
    filter.beginDate = moment(dates[0]).valueOf()
    filter.endDate = moment(dates[1]).valueOf()
    this.setState({ filter })
  }
  onVendorChange = (key, value) => {
    const { filter } = this.state
    filter[key] = value
    this.setState({ filter })
  }

  getSearchDisabled = () => {
    const { filter } = this.state
    if (!filter.beginDate || !filter.endDate || !filter.vendorIdBegin || !filter.vendorIdEnd) {
      return true
    }
    return false
  }
  searchData = () => {
    this.setState({ loading: true }, () => {
      const { filter } = this.state
      this.reportAPI
        .getPurchaseReport({
          beginDate: moment(filter.beginDate).format('YYYY-MM-DD'),
          endDate: moment(filter.endDate).format('YYYY-MM-DD'),
          vendorIdBegin: filter.vendorIdBegin,
          vendorIdEnd: filter.vendorIdEnd
        })
        .then((response) => {
          if (response.code === 0) {
            const statistic = {
              count: response.data.count,
              totalAmount: response.data.totalAmount
            }
            this.setState({
              loading: false,
              list: response.data.purchaseReportItemOutputs.map((row, index) => {
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
      dataIndex: 'vendorId',
      title: '廠商代號',
      fixed: 'left',
      width: 140
    },
    {
      dataIndex: 'vendorName',
      title: '廠商名稱'
    },
    {
      dataIndex: 'count',
      title: '筆數',
      width: 140,
      align: 'right',
      render: (record) => `${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    {
      dataIndex: 'totalAmount',
      title: '進貨金額',
      width: 200,
      align: 'right',
      fixed: 'right',
      render: (record) => {
        return (
          <Typography.Text type='danger'>
            {`$ ${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
        <Table.Summary.Cell>總計:</Table.Summary.Cell>
        <Table.Summary.Cell align='right'>
          <Typography.Text type='success'>{this.state.statistic.count}</Typography.Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell align='right'>
          <Typography.Text type='danger'>
            $ {`${this.state.statistic.totalAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography.Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    ) : null
  getCsvData = () => {
    const { filter, list } = this.state
    const output = list.map((row) => {
      return {
        ...row,
        vendorId: '[' + row.vendorId + ']'
      }
    })
    output.unshift(
      {
        vendorId: '起始日期',
        vendorName: moment(filter.beginDate).format('YYYY-MM-DD'),
        count: '起始廠商代號',
        totalAmount: '[' + filter.vendorIdBegin + ']'
      },
      {
        vendorId: '結束日期',
        vendorName: moment(filter.endDate).format('YYYY-MM-DD'),
        count: '結束廠商代號',
        totalAmount: '[' + filter.vendorIdEnd + ']'
      },
      {},
      {
        vendorId: '客戶代號',
        vendorName: '客戶名稱',
        count: '筆數',
        totalAmount: '總金額'
      }
    )
    return output
  }
  getCsvFilename = () => {
    const { filter } = this.state
    return `進貨單報表_${moment().format('YYYY-MM-DD_HH:mm')}_${moment(filter.beginDate).format(
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
                <div className='report-header-group-title'>起始廠商代碼</div>
                <div className='report-header-group-content'>
                  <Select
                    placeholder='選擇客戶代號'
                    showSearch={true}
                    value={this.state.filter.vendorIdBegin}
                    options={this.getStartVendorOptions()}
                    onChange={this.onVendorChange.bind(this, 'vendorIdBegin')}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} xl={12}>
              <div className='report-header-group'>
                <div className='report-header-group-title'>結束廠商代碼</div>
                <div className='report-header-group-content'>
                  <Select
                    placeholder='選擇客戶代號'
                    showSearch={true}
                    value={this.state.filter.vendorIdEnd}
                    options={this.getEndVendorOptions()}
                    onChange={this.onVendorChange.bind(this, 'vendorIdEnd')}
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
          rowKey='vendorId'
          size='small'
          columns={this.getColumns()}
          loading={this.state.loading}
          dataSource={this.state.list}
          summary={this.getSummary}
          scroll={{ x: 740 }}
          pagination={false}
        />
      </Spin>
    )
  }
}
