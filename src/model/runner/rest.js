import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_HOST

export const restInstance = (method, requestUrl, data) => {
  const url = baseUrl + requestUrl
  const config = {
    url,
    method,
    timeout: 60000,
    headers: {
      // Authorization: 'Basic '
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
        console.log(error.response)
      })
  })
}
