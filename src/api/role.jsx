import { request } from "@/common/request"

//角色创建
export const addRole = (data) => {
  return request({
    url: '/Role/AddRole',
    method: 'post',
    data: data
  })
}
//角色修改
export const updateRole = (data) => {
  return request({
    url: '/Role/UpdateRole',
    method: 'put',
    data: data
  })
}
//角色删除
export const deleteRole = (data) => {
  return request({
    url: '/Role/DeleteRole',
    method: 'delete',
    params: data
  })
}
//获取角色列表-分页
export const getRoles = (data) => {
  return request({
    url: '/Role/GetRoles',
    method: 'get',
    params: data
  })
}
//获取所有角色列表
export const getAllRoles = () => {
  return request({
    url: '/Role/GetAllRoles',
    method: 'get',
    params: {}
  })
}