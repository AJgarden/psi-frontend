import { restInstance } from '../runner/rest'

export default class DashboardAPI {
  getProductCount = (data) => {
    return restInstance('get', '/v1/products', {
      pageNum: 1,
      pageSize: 999999
    }).then((response) => response.data)
  }
}
