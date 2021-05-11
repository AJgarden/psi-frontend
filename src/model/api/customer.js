import { restInstance } from '../runner/rest'

export default class CustomerAPI {
  getCustomerList = (data) => {
    return restInstance('get', '/customers', data).then((response) => response.data)
  }

  getCustomerData = (customerId) => {
    return restInstance('get', `/customers/${customerId}`).then((response) => response.data)
  }

  addCustomerData = (data) => {
    return restInstance('post', `/customers/${data.customerId}`, data).then((response) => response.data)
  }

  updateCustomerData = (customerId, data) => {
    return restInstance('patch', `/customers/${customerId}`, data).then((response) => response.data)
  }
}
