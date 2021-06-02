import { restInstance } from '../runner/rest'

export default class ComponentAPI {
  getComponentList = (data) => {
    return restInstance('get', '/v1/parts', data).then((response) => response.data)
  }

  getComponentData = (partId) => {
    return restInstance('get', `/v1/parts/${partId}`).then((response) => response.data)
  }

  addComponentData = (data) => {
    return restInstance('post', `/v1/parts/${data.partId}`, data).then((response) => response.data)
  }

  updateComponentData = (partId, data) => {
    return restInstance('patch', `/v1/parts/${partId}`, data).then((response) => response.data)
  }
}
