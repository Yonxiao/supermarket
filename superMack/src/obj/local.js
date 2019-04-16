//本地存储的localStorage的封装
export default {
    //存数据
    save(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    },
    //取数据
    get(key){
        return JSON.parse(window.localStorage.getItem(key))
    },
    //删除指定的key数据
    remove(key){
        window.localStorage.removeItem(key)
    }
}