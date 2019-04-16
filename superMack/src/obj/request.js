/* 这个函数是对于axios的封装 */ 
// 引入axios
import axios from 'axios';
// 引入qs
import qs from 'qs';

import local from '@/obj/local'

// 设置请求的服务器根目录
axios.defaults.baseURL ='http://127.0.0.1:666';

//axios请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    const token = local.get('wummOOO');
    config.headers.authorization = `Bearer ${token}` 
    return config;
})

// 导出请求对象
export default  {
    get (url, params={}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params
            })
                .then(response => {
                    resolve(response.data) // 成功使用resolve处理
                })
                .catch(err => {
                    reject(err) // 失败使用reject处理
                })
        })
    },
    post (url, params={}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(response => {
                    resolve(response.data) // 成功使用resolve处理
                })
                .catch(err => {
                    reject(err) // 失败使用reject处理
                })
        })
    }
}
