// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import locale from 'iview/dist/locale/en-US'
Vue.use(iView, {
  locale
})
Vue.config.lang = 'en-US'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$axios = axios
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import common from './assets/common/function.js'
Vue.prototype.common = common
import date from './assets/common/date.js'
Vue.prototype.date = date
import 'element-ui/lib/theme-chalk/base.css'
import VueX from 'vuex'
Vue.use(VueX)
export const store = new VueX.Store({
  state: {
    showUserInfo: false,
    webSocket: '',
    realTimeInterval: '',
    echartsOne: '',
    echartsTwo: '',
    echartsThree: '',
    readInfo: '',
    readLeftTable: '',
    readSystemStatus:'',
    stompClient: null,
    selectShow: true,
    selectedNum: '1-1-1',
    selectedRouterNum: 1,
    selectSectionWidth: 0,
    selectWidth: '140px',
    api: '/api',
    logoImg:'',
    //打包用
    // api: 'http://58.246.246.102:5678',
    // 获取特定数组中的最大值
    getMax(data) {
      var result = [];
      data.forEach(function (item, index) {
        if(item.value){
          result.push(+(item.value[1]));
        } else {
          result.push(+(item[1]));
        }
      })
      return Math.max.apply(null, result);
    },
    // 获取特定数组中的最小值
    getMin(data) {
      var result = [];
      data.forEach(function (item, index) {
        if(item.value){
          result.push(+(item.value[1]));
        } else {
          result.push(+(item[1]));
        }
      })
      return Math.min.apply(null, result);
    }
  }
})


// 请求拦截器
axios.interceptors.request.use((config) => {
  showFullScreenLoading();
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use((response) => {
  tryHideFullScreenLoading();
  return response
}, (error) => {
  if (error.status !== 200) {
    endLoading();
  }
  return Promise.reject(error)
})
let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
import {
  Loading
} from 'element-ui'
let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: 'Loading……',
    background: 'rgba(0, 0, 0, 0.8)'
  })
}

function endLoading() {
  loading.close()
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
