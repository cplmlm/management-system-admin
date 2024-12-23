import { request } from "@/common/request"

//行政区划创建
export const addArea = (data) => {
  return request({
    url: '/Area/AddArea',
    method: 'post',
    data: data
  })
}
//行政区划修改
export const updateArea = (data) => {
  return request({
    url: '/Area/UpdateArea',
    method: 'put',
    data: data
  })
}
//行政区划删除
export const deleteArea = (data) => {
  return request({
    url: '/Area/DeleteArea',
    method: 'delete',
    params: data
  })
}
//获取行政区划列表-分页
export const getAreas = (data) => {
  return request({
    url: '/Area/GetAreas',
    method: 'get',
    params: data
  })
}
//获取所有行政区划树
export const getAreaTree = () => {
  return request({
    url: '/Area/GetAreaTree',
    method: 'get',
    params: {}
  })
}