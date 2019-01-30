import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    // 登录
    {
      path: '',
      name: 'Login',
      component: () => import('@/components/login/Login'),
      // component: resolve => require(['@/components/login/Login'],resolve)
    },
 
    // headerTitle
    {
      path: '/headerTile',
      name: 'HeaderTitle',
      component: () => import('@/components/headerTitle/HeaderTitle'),
      // component: resolve => require(['@/components/headerTitle/HeaderTitle'],resolve),
    },
    // Product
    {
      path: '/Product',
      name: 'Product',
      component: () => import('@/components/Product/Product'),
    },
     // Order
    //  {
    //    path: '/Order',
    //    name: 'Order',
    //    component: () => import('@/components/Order/OrderList'),
    // },
    // // Support
    // {
    //   path: '/Support',
    //   name: 'Support',
    //   component: () => import('@/components/Support/Support'),
    // }


  ]
})
