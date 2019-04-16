//引入Vue
import Vue from 'vue'
//引入Vue路由
import Router from 'vue-router'
//引入Home组件(不推荐)
// import Home from './views/Home.vue'

//注册路由
Vue.use(Router)

//导出当前路由的实例对象
export default new Router({
  //路由配置
  routes: [
    //根目录重定向到登录
    {
      path:'/',
      redirect:'/login'
    },
    //登录
    {
      path: '/login',//路径
      name: 'login',
      component: () => import('./views/Login/Login.vue')//组件(推荐这个方法 按需求引入)
    },
    //home主页面
    {
      path: '/home',//路径
      name: 'home',
      redirect:'/home/systeminfo',
      component: () => import('./views/Home/Home.vue'),//组件
      children:[
        //系统信息
        {
          path:'/home/systeminfo',
          component:() => import('./views/SystemInfo/SystemInfo.vue')
        },
        //账号添加
        {
          path:'/home/accountadd',
          component: () => import('./views/AccountAdd/AccountAdd.vue')
        },
        //账号管理
        // 个人中心
        {
          path: '/home/personal',
          component: () => import('./views/Personal/Personal.vue'),
        },
        {
          path:'/home/accountmanage',
          component: () => import('./views/AccountManage/AccountManage.vue')
        },
        //密码修改
        {
          path:'/home/passwordmodify',
          component: () => import('./views/PasswordModify/PasswordModify.vue')
        },
        //商品添加
        {
          path:'/home/goodsadd',
          component: () => import('./views/GoodsAdd/GoodsAdd.vue')
        },
        //商品管理
        {
          path:'/home/goodsmanage',
          component: () => import('./views/GoodsManage/GoodsManage.vue')
        },
        //销售统计
        {
          path:'/home/salestotal',
          component: () => import('./views/SalesTotal/SalesTotal.vue')
        },
        //进货统计
        {
          path:'/home/stocktotal',
          component: () => import('./views/StockTotal/StockTotal.vue')
        }
      ]
    }
  ]
})
