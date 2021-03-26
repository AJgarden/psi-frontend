import { restInstance } from '../runner/rest'

export default class VehicleAPI {
  getVehicleList = (data) => {
    return restInstance('get', '/kinds', data).then((response) => response.data)
  }

  getVehicleData = (kindId) => {
    return restInstance('get', `/kinds/${kindId}`).then((response) => response.data)
  }

  updateVehicleData = (kindId, data) => {
    return restInstance('patch', `/kinds/${kindId}`, data).then((response) => response.data)
  }
}
