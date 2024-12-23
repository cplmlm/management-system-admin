import { action  } from "mobx"
import { makeAutoObservable } from "mobx"
import { makePersistable,isHydrated } from "mobx-persist-store"; // 引入相关api
class AppState {
    userInfo = null;//用户信息
    token = "";//token
    areas=[];//行政区划树
     organizations=[];//机构列表
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
        makePersistable(this, {  // 在构造函数内使用 makePersistable
            name:'UserStore', // 保存的name，用于在storage中的名称标识，只要不和storage中其他名称重复就可以
            properties: ["userInfo","token","areas","organizations"], // 要保存的字段，这些字段会被保存在name对应的storage中，注意：不写在这里面的字段将不会被保存，刷新页面也将丢失：get字段例外。get数据会在数据返回后再自动计算
            storage: window.localStorage, // 保存的位置：看自己的业务情况选择，可以是localStorage，sessionstorage
            // 。。还有一些其他配置参数，例如数据过期时间等等，可以康康文档，像storage这种字段可以配置在全局配置里，详见文档
        }).then(
            action((persistStore) => { // persist 完成的回调，在这里可以执行一些拿到数据后需要执行的操作，如果在页面上要判断是否完成persist，使用 isHydrated
             // console.log(persistStore);
            }))
    }
    // 保存用户信息
    setUserInfo = (userInfo = null) => {
        this.userInfo = userInfo
    }
    // 保存用户token
    setToken = (token) => {
        this.token = token
    }
    // 保存行政区划树
    setAreas = (data=[]) => {
        this.areas = data
    }
    // 保存机构列表
    setOrganization = (data=[]) => {
        this.organizations = data
    }
    // 重置用户信息和token数据
    reset = () => {
        this.userInfo = null
        this.token = ""
        this.organizations = []
    }
    // 注意这个字段的使用：在页面useEffect的时候，如果你没有添加依赖数组（初始化执行），那么你可能拿不到computed计算的数据（原因是这时候还没有persist结束）,所以
    // 这个属性还是比较重要的，因为它可以在页面上做判断，当页面load完成，get数据计算完成之后，isHydrated会置为true
    get isHydrated() {
        return isHydrated(this);
    }
    get token(){
        return this.userInfo ? this.userInfo.token : ''
    }
}

export default new AppState()
