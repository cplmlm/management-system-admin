import { createHashRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/login'
import Entry from '@/pages/entry'
import Home from '@/pages/home'
import LayoutIndex from '@/pages/layout'
import User from '@/pages/user'
import Role from '@/pages/role'
import Organization from '@/pages/organization'
import Module from '@/pages/module'
import Dictionary from '@/pages/dictionary'
import Permission from '@/pages/permission'
import Assign from '@/pages/assign'
import Area from '@/pages/area'
import Authorization from '@/pages/authorization'
import SystemConfig from '@/pages/systemConfig'

// 全局路由
export const globalRouters = createHashRouter([
    // 对精确匹配"/login"，跳转Login页面
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/layoutIndex',
        element: <LayoutIndex />,
        children: [
            {
                path: 'home',
                element: <Home />,
                meta: {
                    title: "首页"
                }
            },
            {
                path: 'user',
                element: <User />,
                meta: {
                    title: "用户管理"
                }
            },
            {
                path: 'role',
                element: <Role />,
                meta: {
                    title: "角色管理"
                }
            },
            {
                path: 'organization',
                element: <Organization />,
                meta: {
                    title: "单位管理"
                }
            },
            {
                path: 'module',
                element: <Module />,
                meta: {
                    title: "接口管理"
                }
            },
            {
                path: 'dictionary',
                element: <Dictionary />,
                meta: {
                    title: "数据字典"
                }
            },
            {
                path: 'permission',
                element: <Permission />,
                meta: {
                    title: "菜单管理"
                }
            },
            {
                path: 'assign',
                element: <Assign />,
                meta: {
                    title: "分配权限"
                }
            },
            {
                path: 'area',
                element: <Area />,
                meta: {
                    title: "行政区划"
                }
            },
            {
                path: 'authorization',
                element: <Authorization />,
                meta: {
                    title: "系统授权"
                }
            },
            {
                path: 'systemConfig',
                element: <SystemConfig />,
                meta: {
                    title: "系统配置"
                }
            }
        ]
    }
])

// 路由守卫
export function PrivateRoute(props) {
    // 判断localStorage是否有登录用户信息，如果没有则跳转登录页
    return window.localStorage.getItem("") ? (
        props.children
    ) : (
        <Navigate to="/" />
    )
}

