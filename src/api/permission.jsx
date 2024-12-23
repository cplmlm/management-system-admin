import { request } from "@/common/request"

//菜单创建
export const addPermission = (data) => {
  return request({
    url: '/Permission/Post',
    method: 'post',
    data: data
  })
}
//菜单修改
export const updatePermission = (data) => {
  return request({
    url: '/Permission/Put',
    method: 'put',
    data: data
  })
}
//菜单删除
export const deletePermission = (id) => {
  return request({
    url: '/Permission/Delete',
    method: 'delete',
    params: {
      id:id
    }
  })
}
//菜单获取
export const getPermissions = (data) => {
  return request({
    url: '/Permission/GetTreeTable',
    method: 'get',
    params: data
  })
}
//获取菜单树
export const getPermissionTree = (data) => {
  return request({
    url: '/Permission/GetPermissionTree',
    method: 'get',
    params: data
  })
}
//通过角色获取菜单
export const getPermissionIdByRoleId = (data) => {
  return request({
    url: '/Permission/GetPermissionIdByRoleId',
    method: 'get',
    params: data
  })
}
//保存菜单权限分配
export const assign = (data) => {
  return request({
    url: '/Permission/Assign',
    method: 'post',
    data: data
  })
}
//获取路由树
export const getNavigationBar = (data) => {
  return request({
    url: '/Permission/GetNavigationBar',
    method: 'get',
    params: data
  })
}
