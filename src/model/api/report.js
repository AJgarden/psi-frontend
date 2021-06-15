import { restInstance } from '../runner/rest'

export default class ReportAPI {
  getVendorList = () => {
    return restInstance('get', '/v1/vendor', {
      pageNum: 1,
      pageSize: 999999,
      queryByEnum: 'VENDOR_ID',
      queryKeyWord: ''
    }).then((response) => response.data)
  }

  getCustomerList = () => {
    return restInstance('get', '/v1/customers', {
      pageNum: 1,
      pageSize: 999999,
      queryByEnum: 'CUSTOMER_ID',
      queryKeyWord: ''
    }).then((response) => response.data)
  }

  getPurchaseReport = (data) => {
    return restInstance('get', '/v1/reports/purchase', data).then((response) => response.data)
  }

  getSaleReport = (data) => {
    return restInstance('get', '/v1/reports/sales', data).then((response) => response.data)
  }
}
