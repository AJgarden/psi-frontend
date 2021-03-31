import { restInstance } from '../runner/rest'

export default class GlobalAPI {
  getUnitList = () => {
    return restInstance('get', '/common/units').then((response) => response.data)
  }
}
