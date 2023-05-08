import axios from 'axios'
import { router } from '../router/index';
import store from '../store'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_DATA_BASE_API : '/', // api 的 base_url
    timeout: 15000 // 请求超时时间
})


// request拦截器
service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        console.error(error) // for debug
        Promise.reject(error)
    }
)
//
// // response 拦截器
service.interceptors.response.use(
    response => {
        const code = response.status
        if (code < 200 || code > 300) {
            this.$Notice.error({
                title: response.message
            });
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        let code = 0
        try {
            code = error.response.data.status
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                this.$Notice.error({
                    title: '网络请求超时'
                });
                return Promise.reject(error)
            }
        }
        if (code) {
            if (code === 401) {

                this.$Modal.confirm({
                    title: "系统提示",
                    content: "登录状态已过期，您可以继续留在该页面，或者重新登录?",
                    loading: true,
                    okText: "重新登录",
                    cancelText: "取消",
                    onOk: () => {
                        store.dispatch('LogOut').then(() => {
                            location.reload() // 为了重新实例化vue-router对象 避免bug
                        })
                    },
                    onCancel: () => {
                        store.dispatch('LogOut').then(() => {
                            location.reload() // 为了重新实例化vue-router对象 避免bug
                        })
                    },
                });
            } else if (code === 403) {
                router.push({path: '/401'})
            } else {
                const errorMsg = error.response.data.msg
                if (errorMsg !== undefined) {
                    this.$Notice.error({
                        title: errorMsg
                    });
                }
            }
        } else {
            this.$Notice.error({
                title: '接口请求失败'
            });
        }
        return Promise.reject(error)
    }
)
export default service
