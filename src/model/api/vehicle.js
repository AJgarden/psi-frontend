import { restInstance } from '../runner/rest'

export default class VehicleAPI {
  getVehicleList = (data) => {
    return restInstance('get', '/v1/kinds', data).then((response) => response.data)
  }

  getVehicleData = (kindId) => {
    return restInstance('get', `/v1/kinds/${kindId}`).then((response) => response.data)
  }

  addVehicleData = (data) => {
    return restInstance('post', `/v1/kinds/${data.kindId}`, data).then((response) => response.data)
  }

  updateVehicleData = (kindId, data) => {
    return restInstance('patch', `/v1/kinds/${kindId}`, data).then((response) => response.data)
  }
}
