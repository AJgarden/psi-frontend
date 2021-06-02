import { restInstance } from '../runner/rest'

export default class CustomerAPI {
  getCustomerList = (data) => {
    return restInstance('get', '/v1/customers', data).then((response) => response.data)
  }

  getCustomerData = (customerId) => {
    return restInstance('get', `/v1/customers/${customerId}`).then((response) => response.data)
  }

  addCustomerData = (data) => {
    return restInstance('post', `/v1/customers/${data.customerId}`, data).then((response) => response.data)
  }

  updateCustomerData = (customerId, data) => {
    return restInstance('patch', `/v1/customers/${customerId}`, data).then((response) => response.data)
  }
}
