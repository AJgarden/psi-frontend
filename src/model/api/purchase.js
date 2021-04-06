import { restInstance } from '../runner/rest'

export default class PurchaseAPI {
  getPurchaseList = (data) => {
    return restInstance('get', '/purchases', data).then((response) => response.data)
  }
}
