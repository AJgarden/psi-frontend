import { restInstance } from '../runner/rest'

export default class SaleAPI {
  getSaleList = (data) => {
    return restInstance('get', '/v1/sales', data).then((response) => response.data)
  }

  getSaleData = (salesId) => {
    return restInstance('get', `/v1/sales/${salesId}`).then((response) => response.data)
  }

  addSaleData = (data) => {
    return restInstance('post', '/v1/sales', data).then((response) => response.data)
  }

  updateSaleData = (data) => {
    return restInstance('patch', `/v1/sales/${data.salesId}`, data).then(
      (response) => response.data
    )
  }

  getDetailData = (productSeqNo, customerId) => {
    return restInstance('get', `/v1/sales/salesProductItem/${productSeqNo}/${customerId}`).then(
      (response) => response.data
    )
  }

  saveSaleConfirmFlag = (salesId, status) => {
    return restInstance('patch', `/v1/sales/${salesId}/confirmstatus/${status}`).then(
      (response) => response.data
    )
  }

  saveSalePayFlag = (salesId, status) => {
    return restInstance('patch', `/v1/sales/${salesId}/paystatus/${status}`).then(
      (response) => response.data
    )
  }

  searchProductMapping = (realProduct, queryString) => {
    return restInstance('get', '/v1/products/smartQuery', { realProduct, queryString }).then(
      (response) => response.data
    )
  }

  getProductData = (productSeqNo, customerId) => {
    return restInstance('get', `/v1/sales/salesProductItem/${productSeqNo}/${customerId}`).then(
      (response) => response.data
    )
  }

  getProductInventory = (seqNo) => {
    return restInstance('get', `/v1/products/${seqNo}/inventory`).then((response) => response.data)
  }

  getProductHistoryPrice = (productSeqNo, customerId) => {
    return restInstance('get', `/v1/sales/historyPrice/${productSeqNo}/${customerId}`).then(
      (response) => response.data
    )
  }

  getCustomerList = () => {
    return restInstance('get', '/v1/customers', {
      pageNum: 1,
      pageSize: 99999,
      queryByEnum: 'CUSTOMER_ID',
      queryKeyWord: ''
    }).then((response) => response.data)
  }

  getColorsList = () => {
    return restInstance('get', '/v1/colors', {
      pageNum: 1,
      pageSize: 9999,
      colorId: ''
    }).then((response) => response.data)
  }

  getRemarkList = () => {
    return restInstance('get', '/v1/common/remark').then((response) => response.data)
  }

  getPrintData = (salesId) => {
    return restInstance('get', `/v1/sales/print/${salesId}`).then((response) => response.data)
  }
}
