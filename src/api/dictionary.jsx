import { request } from "@/common/request"

//字典类型创建
export const addDictionaryType = (data) => {
  return request({
    url: '/Dictionary/AddDictionaryType',
    method: 'post',
    data: data
  })
}
//字典类型修改
export const updateDictionaryType = (data) => {
  return request({
    url: '/Dictionary/UpdateDictionaryType',
    method: 'put',
    data: data
  })
}
//字典类型删除
export const deleteDictionaryType = (id) => {
  return request({
    url: '/Dictionary/DeleteDictionaryType',
    method: 'delete',
    params: {
      id: id
    }
  })
}
//字典类型获取-分页
export const getDictionaryTypes = (data) => {
  return request({
    url: '/Dictionary/GetDictionaryTypes',
    method: 'get',
    params: data
  })
}
//字典类型获取
export const getAllDictionaryTypes = (data) => {
  return request({
    url: '/Dictionary/GetAllDictionaryTypes',
    method: 'get',
    params: data
  })
}

//字典项目创建
export const addDictionaryItem = (data) => {
  return request({
    url: '/Dictionary/AddDictionaryItem',
    method: 'post',
    data: data
  })
}
//字典项目修改
export const updateDictionaryItem = (data) => {
  return request({
    url: '/Dictionary/UpdateDictionaryItem',
    method: 'put',
    data: data
  })
}
//更新redis字典
export const updateRedisDictionaryItems = () => {
  return request({
    url: '/Dictionary/UpdateRedisDictionaryItems',
    method: 'get',
    params: {}
  })
}
//字典项目删除
export const deleteDictionaryItem = (id) => {
  return request({
    url: '/Dictionary/DeleteDictionaryItem',
    method: 'delete',
    params: {
      id: id
    }
  })
}
//字典项目获取
export const getDictionaryItems = (data) => {
  return request({
    url: '/Dictionary/GetDictionaryItems',
    method: 'get',
    params: data
  })
}
//字典项目分页获取
export const getDictionaryItemsPage = (data) => {
  return request({
    url: '/Dictionary/GetDictionaryItemsPage',
    method: 'get',
    params: data
  })
}


//获取所有字典项目
export const getAllDictionaryItems = () => {
  return request({
    url: '/Dictionary/GetAllDictionaryItems',
    method: 'get',
    params: {}
  })
}