import { restInstance } from '../runner/rest'

export default class ColourAPI {
  getColourList = (data) => {
    return restInstance('get', '/v1/colors', data).then((response) => response.data)
  }

  getColourData = (colorId) => {
    return restInstance('get', `/v1/colors/${colorId}`).then((response) => response.data)
  }

  addColourData = (data) => {
    return restInstance('post', `/v1/colors/${data.colorId}`, data).then((response) => response.data)
  }

  updateColourData = (colorId, data) => {
    return restInstance('patch', `/v1/colors/${colorId}`, data).then((response) => response.data)
  }
}
