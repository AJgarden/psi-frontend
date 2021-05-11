import { restInstance } from '../runner/rest'

export default class ColourAPI {
  getColourList = (data) => {
    return restInstance('get', '/colors', data).then((response) => response.data)
  }

  getColourData = (colorId) => {
    return restInstance('get', `/colors/${colorId}`).then((response) => response.data)
  }

  addColourData = (data) => {
    return restInstance('post', `/colors/${data.colorId}`, data).then((response) => response.data)
  }

  updateColourData = (colorId, data) => {
    return restInstance('patch', `/colors/${colorId}`, data).then((response) => response.data)
  }
}
