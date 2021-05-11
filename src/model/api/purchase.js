import { restInstance } from '../runner/rest'

export default class PurchaseAPI {
  getPurchaseList = (data) => {
    return restInstance('get', '/purchases', data).then((response) => response.data)
  }

  getPurchaseData = (purchaseId) => {
    return restInstance('get', `/purchases/${purchaseId}`).then((response) => response.data)
  }

  addPurchaseData = (data) => {
    return restInstance('post', '/purchases', data).then((response) => response.data)
  }

  updatePurchaseData = (data) => {
    return restInstance('patch', `/purchases/${data.purchaseId}`, data).then(
      (response) => response.data
    )
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

  getVendorsList = () => {
    return restInstance('get', '/vendor', {
      pageNum: 1,
      pageSize: 9999,
      queryByEnum: 'VENDOR_ID',
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
