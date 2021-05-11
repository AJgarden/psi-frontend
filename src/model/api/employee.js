import { restInstance } from '../runner/rest'

export default class EmployeeAPI {
  getEmployeeList = (data) => {
    return restInstance('get', '/employees', data).then((response) => response.data)
  }

  getEmployeeData = (employeeId) => {
    return restInstance('get', `/employees/${employeeId}`).then((response) => response.data)
  }

  addEmployeeData = (data) => {
    return restInstance('post', `/employees/${data.employeeId}`, data).then((response) => response.data)
  }

  updateEmployeeData = (employeeId, data) => {
    return restInstance('patch', `/employees/${employeeId}`, data).then((response) => response.data)
  }
}
