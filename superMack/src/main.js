// 引入Vue
import Vue from 'vue'

//引入App.vue顶级组件
import App from './App.vue'

//引入request.js
import request from './obj/request'
//引入local文件
import local from '@/obj/local'
// 挂载原型上
Vue.prototype.request = request;

// 引入echarts且挂载在原型上
import echarts from 'echarts'
Vue.prototype.echarts = echarts;


//引入路由
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'; // JS组件
import 'element-ui/lib/theme-chalk/index.css'; // CSS样式
// message
import { Message } from 'element-ui';

//common.css
import './assets/css/common.css'
//注册
Vue.use(ElementUI);

//阻止生产提示
Vue.config.productionTip = false

//路由守卫拦截
// to 是将要进入的目标路由  from是导航正要离开的路由  next是调用就结束
router.beforeEach((to,from,next) => {
  const token = local.get('wummOOO');
  // console.log(token);
  if(token){
    //放行
    next();
  }else{
    if(to.path === '/login'){
      //去登录路由放行
      next();
    }else{
      //去其他的界面跳转到登录
      next('/login')
    }
  }
})

//创建vue实例对象
new Vue({
  router,//把路由传入渲染
  render: h => h(App)//把顶级组件 App.vue传入渲染
}).$mount('#app')//挂载index.html中的  id为 app的容器
