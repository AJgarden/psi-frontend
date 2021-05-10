import { restInstance } from '../runner/rest'

export default class SupplierAPI {
  getSupplierList = (data) => {
    return restInstance('get', '/v1/vendor', data).then((response) => response.data)
  }

  getSupplierData = (vendorId) => {
    return restInstance('get', `/v1/vendor/${vendorId}`).then((response) => response.data)
  }

  addSupplierData = (data) => {
    return restInstance('post', `/v1/vendor/${data.vendorId}`, data).then((response) => response.data)
  }

  updateSupplierData = (vendorId, data) => {
    return restInstance('patch', `/v1/vendor/${vendorId}`, data).then((response) => response.data)
  }
}
