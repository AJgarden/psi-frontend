import { restInstance } from '../runner/rest'

export default class SupplierAPI {
  getSupplierList = (data) => {
    return restInstance('get', '/vendor', data).then((response) => response.data)
  }

  getSupplierData = (vendorId) => {
    return restInstance('get', `/vendor/${vendorId}`).then((response) => response.data)
  }

  addSupplierData = (data) => {
    return restInstance('post', `/vendor/${data.vendorId}`, data).then((response) => response.data)
  }

  updateSupplierData = (vendorId, data) => {
    return restInstance('patch', `/vendor/${vendorId}`, data).then((response) => response.data)
  }
}
