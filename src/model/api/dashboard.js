import { restInstance } from '../runner/rest'

export default class DashboardAPI {
  getProductCount = (data) => {
    return restInstance('get', '/products', {
      pageNum: 1,
      pageSize: 999999
    }).then((response) => response.data)
  }
}
