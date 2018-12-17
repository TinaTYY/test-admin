import axios from 'axios'
import qs from 'qs'
import router from  '../router'
import {Indicator, Toast} from 'mint-ui' //这是可以去掉的显示插件
// 在config.js文件中统一存放一些公共常量，方便之后维护
import configBase from './config.js'

// 添加请求拦截器，在发送请求之前做些什么(**具体查看axios文档**)--------------------------------------------
axios.interceptors.request.use(function (config) {
    // 显示loading
    Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
    });
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.transformRequest = [function (data) {
        data = qs.stringify(data);
        return data;
    }];
    config.headers['X-USER-TOKEN'] = '';
    if (localStorage.getItem('accessTokenM') && localStorage.getItem('accessTokenM') !== '') {
        config.headers['X-USER-TOKEN'] = localStorage.getItem('accessTokenM')
    }
    return config;
}, function (error) {
    // 请求错误时弹框提示，或做些其他事
    return Promise.reject(error)
});

// 添加响应拦截器(**具体查看axios文档**)----------------------------------------------------------------
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
    // 如果只需要返回体中数据，则如下，如果需要全部，则 return response 即可
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 封装数据返回失败提示函数---------------------------------------------------------------------------
function errorState(response) {
    // 隐藏loading
    Indicator.close();
    // 如果http状态码正常，则直接返回数据

    switch (response.request.status) {
        case 200||304||400:
            return response;
        case 401:
            Toast('信息过期，一秒后重新拉取信息');
            localStorage.removeItem('accessTokenM');
            setTimeout(() => {
                router.push('/')
            }, 2000);
            return response;
        default:
            Toast('错误信息：'+response.data.message+'\n错误码：' + response.data.code);
            return response
    }
}

// 封装数据返回成功提示函数---------------------------------------------------------------------------d
function successState(res) {
    let {code,message}=res.data
    // 隐藏loading
    Indicator.close();
    // 统一判断后端返回的错误码(错误码与后台协商而定)
    switch (code) {
        case 200||4020:
            return res;
        case 500:
            Toast(message);
            return res;
        case 2000:
            Toast(message);
            return res;
        default:
            Toast('错误信息：'+message+'\n错误码：' + code);
            return res;
}
}

// 封装axios--------------------------------------------------------------------------------------
function apiAxios(method, url, params) {
    let httpDefault = {
        method: method,
        baseURL: configBase.baseURL,
        url: url,
        // `params` 是即将与请求一起发送的 URL 参数
        // `data` 是作为请求主体被发送的数据
        params: method === 'GET' || method === 'DELETE' ? params : null,
        data: method === 'POST' || method === 'PUT' ? params : null,
        timeout: 10000
    };
    // 注意**Promise**使用(Promise首字母大写)
    return new Promise((resolve, reject) => {
        axios(httpDefault)
        // 此处的.then属于axios
            .then((res) => {
                resolve(successState(res))
            }).catch((response) => {
                reject(errorState(response))
        })
    })
}

// 输出函数getAxios、postAxios、putAxios、delectAxios，供其他文件调用-----------------------------
// Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。

Plugin.install = function (Vue, options) {
    Vue.$axios = axios;
    Vue.prototype.$axios = axios;
    window.axios = axios;
    window.getAxios = (url, params) => apiAxios('GET', url, params);
    window.postAxios = (url, params) => apiAxios('POST', url, params);
    window.putAxios = (url, params) => apiAxios('PUT', url, params);
    window.delectAxios = (url, params) => apiAxios('DELECT', url, params);
    Vue.prototype.getAxios = (url, params) => apiAxios('GET', url, params);
    Vue.prototype.postAxios = (url, params) => apiAxios('POST', url, params);
    Vue.prototype.putAxios = (url, params) => apiAxios('PUT', url, params);
    Vue.prototype.delectAxios = (url, params) => apiAxios('DELECT', url, params);
};
export default Plugin