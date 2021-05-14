import { restInstance } from '../runner/rest'

export default class SaleAPI {
  getSaleList = (data) => {
    return restInstance('get', '/sales', data).then((response) => response.data)
  }

  getSaleData = (salesId) => {
    return restInstance('get', `/sales/${salesId}`).then((response) => response.data)
  }

  addSaleData = (data) => {
    return restInstance('post', '/sales', data).then((response) => response.data)
  }

  updateSaleData = (data) => {
    return restInstance('patch', `/sales/${data.salesId}`, data).then(
      (response) => response.data
    )
  }

  saveSaleConfirmFlag = (salesId, status) => {
    return restInstance('patch', `/sales/${salesId}/confirmstatus/${status}`).then((response) => response.data)
  }

  saveSalePayFlag = (salesId, status) => {
    return restInstance('patch', `/sales/${salesId}/paystatus/${status}`).then((response) => response.data)
  }

  searchProductMapping = (realProduct, queryString) => {
    return restInstance('get', '/products/smartQuery', { realProduct, queryString }).then(
      (response) => response.data
    )
  }

  getProductData = (seqNo) => {
    return restInstance('get', `/products/${seqNo}`).then((response) => response.data)
  }

  getProductHistoryPrice = (productSeqNo) => {
    return restInstance('get', '/products/historyPurchasePrice', { productSeqNo }).then(
      (response) => response.data
    )
  }

  getCustomerList = () => {
    return restInstance('get', '/customers', {
      pageNum: 1,
      pageSize: 99999,
      queryByEnum: 'CUSTOMER_ID',
      queryKeyWord: ''
    }).then((response) => response.data)
  }

  getColorsList = () => {
    return restInstance('get', '/colors', {
      pageNum: 1,
      pageSize: 9999,
      colorId: ''
    }).then((response) => response.data)
  }
}
