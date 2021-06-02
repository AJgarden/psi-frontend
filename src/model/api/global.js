import { restInstance } from '../runner/rest'

export default class GlobalAPI {
  getUnitList = () => {
    return restInstance('get', '/v1/common/units').then((response) => response.data)
  }
}
