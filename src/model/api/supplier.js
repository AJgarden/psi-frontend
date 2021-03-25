import { restInstance } from '../runner/rest'

export default class SupplierAPI {
  getSupplierList = (data) => {
    return restInstance('get', '/vendor', data).then((response) => response.data)
  }
}
