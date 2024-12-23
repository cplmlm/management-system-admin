import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { globalRouters } from './router'
import { ConfigProvider } from 'antd'
// 引入Ant Design中文语言包
import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import './styles/frame.less'// 全局样式


ReactDOM.createRoot(document.getElementById('root')).render(
        <ConfigProvider locale={zhCN}>
            <RouterProvider router={globalRouters} />
        </ConfigProvider>
)
