import { restInstance } from '../runner/rest'

export default class ComponentAPI {
  getComponentList = (data) => {
    return restInstance('get', '/parts', data).then((response) => response.data)
  }

  getComponentData = (partId) => {
    return restInstance('get', `/parts/${partId}`).then((response) => response.data)
  }

  addComponentData = (data) => {
    return restInstance('post', `/parts/${data.partId}`, data).then((response) => response.data)
  }

  updateComponentData = (partId, data) => {
    return restInstance('patch', `/parts/${partId}`, data).then((response) => response.data)
  }
}
