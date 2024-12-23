import { request } from "@/common/request"

//1.登录请求
export const userLogin = (data) => {
  return request({
    url: '/User/UserLogin',
    method: 'get',
    params: data
  })
}

//用户创建
export const addUser = (data) => {
  return request({
    url: '/User/AddUser',
    method: 'post',
    data: data
  })
}
//用户修改
export const updateUser = (data) => {
  return request({
    url: '/User/UpdateUser',
    method: 'put',
    data: data
  })
}
//用户修改密码
export const updatePassword = (data) => {
  return request({
    url: '/User/UpdatePassword',
    method: 'put',
    data: data
  })
}

//用户删除
export const deleteUser = (id) => {
  return request({
    url: '/User/DeleteUser',
    method: 'delete',
    params: {
      id:id
    }
  })
}
//用户获取
export const getUsers = (data) => {
  return request({
    url: '/User/GetUsers',
    method: 'get',
    params: data
  })
}

//获取用户信息通过token
export const getInfoByToken = (token) => {
  return request({
    url: '/User/GetInfoByToken',
    method: 'get',
    params: {
      token:token
    }
  })
}
//获取明文密码
export const getPlaintextPassword = (ciphertext) => {
  return request({
    url: '/User/GetPlaintextPassword',
    method: 'get',
    params: {
      ciphertext:ciphertext
    }
  })
}
//重置密码
export const resetUserPassword = () => {
  return request({
    url: '/User/ResetUserPassword',
    method: 'get',
    params: {}
  })
}