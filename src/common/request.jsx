import axios from 'axios';
import { Modal, message } from "antd";
import userStore from "@/store/index";
import { globalRouters } from '@/router'

const request = axios.create({
  baseURL: window.config.baseUrl,
  timeout: 10000,
})

// 添加请求拦截器 做拦截，加入一些自定义的配置【参数的处理】
request.interceptors.request.use((config) => {
  //操作这个config 注入token数据
  //1.获取token
  //2.按照后端的格式要求做token的拼接
  const token = userStore?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // 在发送请求之前做些什么
  return config;
}, (error) => {
  // 对请求错误做些什么
  if(error.response?.data?.message){
    Modal.error({
      title: '错误信息',
      content: error.response.data.message,
    });
  }
 // return Promise.reject(error);
});

// 添加响应拦截器 在响应但会到客户端之前做响应
request.interceptors.response.use((response) => {
  if (response.data?.status !== 200) {
    message.error(response.data?.message!==""?response.data?.message:JSON.stringify(response.data.data.errors))
  }
  // 对响应数据做点什么
  return response.data;
}, (error) => {
  // 对响应错误做点什么
  //监控401token失效
  // console.log(error);
   if (error.response?.status === 401) {
   userStore.reset()
   globalRouters.navigate('/').then(() =>{
      window.location.reload()
    })
   }
  if(error.response?.status ===500){
    Modal.error({
      title: '错误信息',
      content: error.response.statusText,
    });
  }
  if(error.response?.data?.message){
    Modal.error({
      title: '错误信息',
      content: error.response.data.message,
    });
  }
  //return Promise.reject(error.response);
});

export { request };
