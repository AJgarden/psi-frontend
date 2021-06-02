import { restInstance } from '../runner/rest'

export default class EmployeeAPI {
  getEmployeeList = (data) => {
    return restInstance('get', '/v1/employees', data).then((response) => response.data)
  }

  getEmployeeData = (employeeId) => {
    return restInstance('get', `/v1/employees/${employeeId}`).then((response) => response.data)
  }

  addEmployeeData = (data) => {
    return restInstance('post', `/v1/employees/${data.employeeId}`, data).then((response) => response.data)
  }

  updateEmployeeData = (employeeId, data) => {
    return restInstance('patch', `/v1/employees/${employeeId}`, data).then((response) => response.data)
  }
}
