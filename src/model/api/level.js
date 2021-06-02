import { restInstance } from '../runner/rest'

export default class LevelAPI {
  getLevelList = (data) => {
    return restInstance('get', '/v1/grades', data).then((response) => response.data)
  }

  getLevelData = (gradeId) => {
    return restInstance('get', `/v1/grades/${gradeId}`).then((response) => response.data)
  }

  addLevelData = (data) => {
    return restInstance('post', `/v1/grades/${data.gradeId}`, data).then((response) => response.data)
  }

  updateLevelData = (gradeId, data) => {
    return restInstance('patch', `/v1/grades/${gradeId}`, data).then((response) => response.data)
  }
}
