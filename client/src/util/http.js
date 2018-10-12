import axios from 'axios'
import { apiBaseUrl } from '../../projectConfig'

export const get = (url, params) => new Promise((resolve, reject) => {
  axios.get(apiBaseUrl + url, params).then(resp => {
    if (resp && resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})

export const post = (url, postData) => new Promise((resolve, reject) => {
  axios.post(apiBaseUrl + url, postData).then(resp => {
    if (resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})

export const dele = (url, params) => new Promise((resolve, reject) => {
  axios.delete(apiBaseUrl + url, params).then(resp => {
    if (resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})

export const put = (url, postData) => new Promise((resolve, reject) => {
  axios.put(apiBaseUrl + url, postData).then(resp => {
    if (resp.code === 1) {
      resolve(resp.data)
    } else {
      reject(resp)
    }
  })
})
