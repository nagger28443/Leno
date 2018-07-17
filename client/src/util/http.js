import axios from 'axios'
import { serverHost } from '../../projectConfig'

const apiBaseUrl = `http://${serverHost}:3000`

const parseUrl = (url, params = {}) => {
  const strParams = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')
  console.log(strParams)
  return strParams ? `${apiBaseUrl}${url}?${strParams}` : `${apiBaseUrl}${url}`
}

export const get = (url, params) =>
  new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params)).then(resp => {
      if (resp.code === 1) {
        resolve(resp.data)
      } else {
        reject(resp)
      }
    })
  })

export const post = (url, postData) =>
  new Promise((resolve, reject) => {
    axios.post(parseUrl(url), postData).then(resp => {
      if (resp.code === 1) {
        resolve(resp.data)
      } else {
        reject(resp)
      }
    })
  })
export const dele = (url, params) =>
  new Promise((resolve, reject) => {
    axios.delete(parseUrl(url, params)).then(resp => {
      if (resp.code === 1) {
        resolve(resp.data)
      } else {
        reject(resp)
      }
    })
  })

export const put = (url, postData) =>
  new Promise((resolve, reject) => {
    axios.put(url, postData).then(resp => {
      if (resp.code === 1) {
        resolve(resp.data)
      } else {
        reject(resp)
      }
    })
  })
