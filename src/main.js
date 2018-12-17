import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Plugin from './plugins/axios'
import 'lib-flexible';
import {Indicator,InfiniteScroll,Toast} from 'mint-ui'


import 'mint-ui/lib/style.css'
import './assets/css/normal.scss'





//金钱格式化全局设置
Vue.prototype.$formatter=(o)=>{
    let arr = o.split('.');
    let tmp = arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    o = tmp + '.' + (arr[1] || '00').substring(0, 2);
    return o
};
Vue.prototype.getUrlParams=(name)=>{
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
//引入Axios.js
Vue.use(Plugin);
Vue.use(InfiniteScroll);
//引入MintUI ,部分暂不需要
Vue.prototype.$toast=Toast;
Vue.prototype.$indicator=Indicator;
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');