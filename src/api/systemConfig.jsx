import { request } from "@/common/request"

//系统配置创建
export const addSystemConfig = (data) => {
  return request({
    url: '/SystemConfig/AddSystemConfig',
    method: 'post',
    data: data
  })
}
//系统配置修改
export const updateSystemConfig = (data) => {
  return request({
    url: '/SystemConfig/UpdateSystemConfig',
    method: 'put',
    data: data
  })
}
//系统配置删除
export const deleteSystemConfig = (id) => {
  return request({
    url: '/SystemConfig/DeleteSystemConfig',
    method: 'delete',
    params: {
      id: id
    }
  })
}
//系统配置获取
export const getSystemConfigs = (data) => {
  return request({
    url: '/SystemConfig/GetSystemConfigs',
    method: 'get',
    params: data
  })
}
