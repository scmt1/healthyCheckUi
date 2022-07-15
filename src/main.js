// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css';
import App from './App'
import {router} from './router/index'
import store from './store'
import i18n from '@/locale'
import axios from 'axios'
import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios'
import {setStore, getStore, removeStore} from '@/libs/storage'
import {format} from "date-fns";
import util from '@/libs/util'
import hasPermission from '@/libs/hasPermission'
import hasRole from '@/libs/hasRole'
import iviewArea from '@/views/my-components/iview-area';
import XIcon from '@/views/my-components/scmt/x-icon'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import VueApexCharts from 'vue-apexcharts'
import './assets/iconfont/iconfont.css'
import '@babel/polyfill'
import menu from "./views/main-components/menu";

// 大数据表格
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.use(VXETable);
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
VXETable.use(VXETablePluginExportXLSX);

Vue.config.productionTip = false
import iViewPro from '@/iview-pro/iview-pro.min.js'
import '@/iview-pro/iview-pro.css'
Vue.use(VueLazyload, {
    error: require('./assets/img-error.png'),
    loading: require('./assets/loading2.gif')
})
Vue.use(ViewUI, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(VueClipboard);
Vue.use(hasPermission);
Vue.use(hasRole);
Vue.use(iviewArea);
Vue.use(XIcon);
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
// 挂载全局使用的方法
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.postBodyRequest = postBodyRequest;
Vue.prototype.getNoAuthRequest = getNoAuthRequest;
Vue.prototype.postNoAuthRequest = postNoAuthRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.format = format;
Vue.use(iViewPro);
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(menu)
Vue.component('Menus', menu)
Vue.use(Viewer)

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)



import 'element-ui/lib/theme-chalk/index.css';
import { Tabs,TabPane ,InfiniteScroll} from 'element-ui';
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(InfiniteScroll)

import vRegion from 'v-region'
Vue.use(vRegion, { })

axios.get('/hospitalName.json').then(res => { // 获取public下的json文件数据
    if(res){
        Vue.prototype.$hospitalName = res;
    }
});
axios.get('/proType.json').then(res => { // 获取public下的json文件数据
    if(res){
        Vue.prototype.$proType = res;
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        // 加载主题
        this.$store.commit('setTheme', localStorage.theme);
        // 初始化菜单
        util.initRouter(this);
        // 设置用户信息
        this.$store.commit("setUserInfo", {nickname: localStorage.nickname, avatar: localStorage.avatar});
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    }
})
