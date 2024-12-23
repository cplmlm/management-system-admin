import { request } from "@/common/request"

//机构创建
export const addOrganization = (data) => {
  return request({
    url: '/Organization/AddOrganization',
    method: 'post',
    data: data
  })
}
//机构修改
export const updateOrganization = (data) => {
  return request({
    url: '/Organization/UpdateOrganization',
    method: 'put',
    data: data
  })
}
//机构删除
export const deleteOrganization = (id) => {
  return request({
    url: '/Organization/DeleteOrganization',
    method: 'delete',
    params: {
      id: id
    }
  })
}
//机构获取
export const getOrganizations = (data) => {
  return request({
    url: '/Organization/GetTreeTable',
    method: 'get',
    params: data
  })
}
//获取所有机构列表
export const getAllOrganizations = () => {
  return request({
    url: '/Organization/GetAllOrganizations',
    method: 'get',
    params: {}
  })
}