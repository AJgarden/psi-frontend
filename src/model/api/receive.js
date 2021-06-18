import { restInstance } from '../runner/rest'

export default class ReceiveAPI {
  getReceiveList = (data) => {
    return restInstance('get', '/v1/payment_receive', data).then((response) => response.data)
  }

  getCustomerList = () => {
    return restInstance('get', '/v1/customers', {
      pageNum: 1,
      pageSize: 99999,
      queryByEnum: 'CUSTOMER_ID',
      queryKeyWord: ''
    }).then((response) => response.data)
  }

  getReceiveData = (paymentReceiveId) => {
    return restInstance('get', `/v1/payment_receive/${paymentReceiveId}`).then(
      (response) => response.data
    )
  }

  getCustomerInfo = (customerId) => {
    return restInstance('get', `/v1/payment_receive/customerInfo/${customerId}`).then(
      (response) => response.data
    )
  }

  getCustomerAccount = (customerId, salesAccountingDate) => {
    return restInstance('get', `/v1/payment_receive/${customerId}/${salesAccountingDate}`).then(
      (response) => response.data
    )
  }

  saveReceive = (data) => {
    return restInstance('post', '/v1/payment_receive', data).then((response) => response.data)
  }

  abortReceive = (paymentReceiveId) => {
    return restInstance('patch', `/v1/payment_receive/${paymentReceiveId}`).then(
      (response) => response.data
    )
  }
}
