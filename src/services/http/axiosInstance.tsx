import axios from 'axios'
import { getAccessToken, removeAccessToken } from '../storage/storage'

const apiUrl = process.env.REACT_APP_API_URL
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const axiosInstance = axios.create({
  baseURL: `${apiUrl}`
})

axiosInstance.interceptors.request.use(
  async config => {
    const token = getAccessToken()

    config.headers.Authorization = `Bearer ${token}`
    config.headers.Accept = 'application/json'
    config.headers['X-User-Timezone'] = userTimezone

    return config
  },
  error => {
    Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined') {
        removeAccessToken()
        window.location.href = '/'
      } else {
        return Promise.reject(error)
      }
    } else {
      console.error(error)
      return Promise.reject(error)
    }
  }
)

export default axiosInstance
