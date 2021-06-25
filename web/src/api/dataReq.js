// import axios from 'axios'
import request from '@/utils/request'

export function getProteinData(params) {
  return request({
    url: '/api/proteins',
    method: 'post',
    data:params
  })
}

// export function getProteinFile(){
//   return request({
//     url: '/api/proteins/file',
//     method: 'get',
//   })
// }

// const instance = axios.create({
//   baseURL: "http://127.0.0.1:3000",
//   timeout: 5000
// });

// export function getFile(url, params){
//   return instance.get(url, {
//     params
//   });
// }

// export function getAll(url, data){
//   return instance.post(url, data)
// }