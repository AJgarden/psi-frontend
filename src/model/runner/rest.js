import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_HOST
const testBaseUrl = process.env.REACT_APP_TESTAPI_HOST

const getAuth = () => {
  const cookies = document.cookie.split(';')
  const auth = cookies.find((cookie) => cookie.includes('MOTOBUY_AUTH'))
  return auth ? auth.split('=')[1] : ''
}

export const restInstanceWithoutAuth = (method, requestUrl, data) => {
  const url = baseUrl + requestUrl
  const config = {
    url,
    method,
    timeout: 60000
  }
  if (method === 'get' && data && Object.keys(data).length > 0) {
    config.params = data
  } else if (data && Object.keys(data).length > 0) {
    config.data = data
  }
  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
        console.log(error.response)
      })
  })
}

export const restInstance = (method, requestUrl, data) => {
  const url = baseUrl + requestUrl
  const config = {
    url,
    method,
    timeout: 60000,
    headers: {
      Authorization: 'Basic ' + getAuth()
    }
  }
  if (method === 'get' && data && Object.keys(data).length > 0) {
    config.params = data
  } else if (data && Object.keys(data).length > 0) {
    config.data = data
  }
  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
        console.log(error.response)
      })
  })
}

export const restUploadInstance = (method, requestUrl, data) => {
  const url = baseUrl + requestUrl
  const config = {
    url,
    method,
    timeout: 60000,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: 'Basic ' + getAuth()
    },
    data
  }
  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
        console.log(error.response)
      })
  })
}

export const testRestInstance = (method, requestUrl, data) => {
  const url = testBaseUrl + requestUrl
  const config = {
    url,
    method,
    timeout: 60000,
    headers: {
      Authorization: 'Basic ' + getAuth()
    }
  }
  if (method === 'get' && data && Object.keys(data).length > 0) {
    config.params = data
  } else if (data && Object.keys(data).length > 0) {
    config.data = data
  }
  return new Promise((resolve, reject) => {
    axios(config)
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error)
        console.log(error.response)
      })
  })
}
