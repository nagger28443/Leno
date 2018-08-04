import axios from 'axios'
import { apiBaseUrl } from '../../projectConfig'

const parseUrl = (url, params = {}) => {
  const strParams = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return strParams ? `${apiBaseUrl}${url}?${strParams}` : `${apiBaseUrl}${url}`
}

export const get = (url, params) => new Promise((resolve, reject) => {
  axios.get(parseUrl(url, params)).then(resp => {
    if (resp && resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})

export const post = (url, postData) => new Promise((resolve, reject) => {
  axios.post(parseUrl(url), postData).then(resp => {
    if (resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})

export const dele = (url, params) => new Promise((resolve, reject) => {
  axios.delete(parseUrl(url, params)).then(resp => {
    if (resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})

export const put = (url, postData) => new Promise((resolve, reject) => {
  axios.put(parseUrl(url), postData).then(resp => {
    if (resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})
