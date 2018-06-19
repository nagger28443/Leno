import axios from 'axios'
import { serverHost, serverPort } from '../../projectConfig'

const apiBaseUrl = `http://${serverHost}:${serverPort}`

const parseUrl = (url, params = {}) => {
  const strParams = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return strParams ? `${apiBaseUrl}${url}?${strParams}` : `${apiBaseUrl}${url}`
}

export const get = (url, params) =>
  new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params)).then(resp => {
      const { data } = resp
      if (data.code === 20000) {
        resolve(data)
      } else if (data.code === 20010) {
        // redirect
      } else {
        reject(data)
      }
    })
  })

export const post = (url, params, postData) =>
  new Promise((resolve, reject) => {
    axios.post(parseUrl(url, params), postData).then(resp => {
      const { data } = resp
      if (data.code === 20000) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
export const dele = (url, params) =>
  new Promise((resolve, reject) => {
    axios.delete(parseUrl(url, params)).then(resp => {
      const { data } = resp
      if (data.message === 'success') {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })

export const put = (url, params, postData) =>
  new Promise((resolve, reject) => {
    axios.put(parseUrl(url, params), postData).then(resp => {
      const { data } = resp
      if (data.message === 'success') {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
