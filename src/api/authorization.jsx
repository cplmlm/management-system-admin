import { request } from "@/common/request"

//系统注册
export const systemRegister = (data) => {
  return request({
    url: '/Authorization/SystemRegister',
    method: 'post',
    data: data
  })
}
//获取系统注册信息
export const getSystemRegisterInfo = () => {
  return request({
    url: '/Authorization/GetSystemRegisterInfo',
    method: 'get',
    params: {}
  })
}
//根据机器码生成注册码
export const generateRegisterCode = (data) => {
  return request({
    url: '/Authorization/GenerateRegisterCode',
    method: 'get',
    params: data
  })
}
//生成机器码
export const generateMachineCode = () => {
  return request({
    url: '/Authorization/GenerateMachineCode',
    method: 'get',
    params: {}
  })
}