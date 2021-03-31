import { restInstance } from '../runner/rest'

export default class LevelAPI {
  getLevelList = (data) => {
    return restInstance('get', '/grades', data).then((response) => response.data)
  }

  getLevelData = (gradeId) => {
    return restInstance('get', `/grades/${gradeId}`).then((response) => response.data)
  }

  addLevelData = (data) => {
    return restInstance('post', `/grades/${data.gradeId}`, data).then((response) => response.data)
  }

  updateLevelData = (gradeId, data) => {
    return restInstance('patch', `/grades/${gradeId}`, data).then((response) => response.data)
  }
}
