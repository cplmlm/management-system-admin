import { request } from "@/common/request"

//接口创建
export const addModule = (data) => {
  return request({
    url: '/Module/Post',
    method: 'post',
    data: data
  })
}
//接口修改
export const updateModule = (data) => {
  return request({
    url: '/Module/Put',
    method: 'put',
    data: data
  })
}
//接口删除
export const deleteModule = (id) => {
  return request({
    url: '/Module/Delete',
    method: 'delete',
    params: {
      id:id
    }
  })
}
//接口获取
export const getModules = (data) => {
  return request({
    url: '/Module/Get',
    method: 'get',
    params: data
  })
}