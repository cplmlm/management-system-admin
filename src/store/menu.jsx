import { makeAutoObservable } from "mobx"
import { makePersistable } from "mobx-persist-store"; // 引入相关api
class AppState {
    menus = [];//菜单
    breadcrumbItems = [];//面包屑
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        makePersistable(this, {  // 在构造函数内使用 makePersistable
            name: 'MenuStore', // 保存的name，用于在storage中的名称标识，只要不和storage中其他名称重复就可以
            properties: ["menus","breadcrumbItems"], // 要保存的字段，这些字段会被保存在name对应的storage中，注意：不写在这里面的字段将不会被保存，刷新页面也将丢失：get字段例外。get数据会在数据返回后再自动计算
            storage: window.sessionStorage, // 保存的位置：看自己的业务情况选择，可以是localStorage，sessionstorage
        })
    }
    // 保存菜单信息
    setMenus = (menus = []) => {
        this.menus = menus
    }
    // 设置面包屑
    setBreadcrumbItems = (breadcrumbItems = []) => {
        this.breadcrumbItems = breadcrumbItems
    }
    // 重置菜单信息
    resetMenus = () => {
        this.menus = []
        this.breadcrumbItems = []
    }

}

export default new AppState()
