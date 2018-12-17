import Vue from 'vue';
import Router from 'vue-router';
import {Indicator} from 'mint-ui';

// 404
const NotFound = resolve => {
    Indicator.open();
    require.ensure([/* webpackChunkName: "NotFound",webpackPrefetch: true */  './views/NotFound'], () => {
        resolve(require(/* webpackChunkName: "NotFound" */  './views/NotFound'));
       //Indicator.close()
    })
};
// 空白页面
const MerchantNotAnything = resolve => {
    Indicator.open();
    require.ensure([/* webpackChunkName: "MerchantNotAnything" ,webpackPrefetch: true*/  './views/MerchantNotAnything'], () => {
        resolve(require(/* webpackChunkName: "MerchantNotAnything" ,webpackPrefetch: true*/  './views/MerchantNotAnything'));
       //Indicator.close()
    })
};
// 登录
const MerchantLogin = resolve => {
    Indicator.open();
    require.ensure([/* webpackChunkName: "login" ,webpackPrefetch: true*/  './views/MerchantLogin'], () => {
        resolve(require(/* webpackChunkName: "login" ,webpackPrefetch: true*/  './views/MerchantLogin'));
       //Indicator.close()
    })
};
//主菜单
const MerchantHome = resolve => {
    Indicator.open();
    require.ensure([/* webpackChunkName: "MerchantHome" ,webpackPrefetch: true*/  './views/MerchantHome'], () => {
        resolve(require(/* webpackChunkName: "MerchantHome" ,webpackPrefetch: true*/  './views/MerchantHome'));
       //Indicator.close()
    })
};
//主菜单主界面
const MerchantHomeLi = resolve => {
    Indicator.open();
    require.ensure([/* webpackChunkName: "MerchantHome-MerchantHomeLi" ,webpackPrefetch: true*/  './views/MerchantHomeLi'], () => {
        resolve(require(/* webpackChunkName: "MerchantHome-MerchantHomeLi",webpackPrefetch: true */  './views/MerchantHomeLi'));
       //Indicator.close()
    })
};

// 明细
const MerchantOrderMore = resolve => {
    Indicator.open();
    require.ensure([/* webpackChunkName: "MerchantHome-MerchantHomeDetailed",webpackPrefetch: true */  './views/MerchantOrderMore'], () => {
        resolve(require(/* webpackChunkName: "MerchantHome-MerchantHomeDetailed",webpackPrefetch: true */  './views/MerchantOrderMore'));
       //Indicator.close()
    })
};




let router=new Router({
    routes: [
        {
            path: '/',
            name: 'notAnything',
            meta: {
                title: '',
            },
            component: MerchantNotAnything
        }, {
            path: '*',
            name: 'NotFound',
            meta: {
                title: '404',
            },
            component: NotFound
        }, {
            path: '/MerchantLogin',
            name: 'MerchantLogin',
            meta: {
                title: '商户登录绑定'
            },
            component: MerchantLogin
        },
        {
            path: '/MerchantHome',
            name: 'MerchantHome',
            component: MerchantHome,
            meta: {
                title: '配送列表',
                allowBack: false,
                requireAuth: true,
            },
            redirect: '/MerchantHome/MerchantHomeLi',
            children: [
                {
                    path: '/MerchantHome/MerchantHomeLi',
                    name: 'MerchantHomeLi',
                    component: MerchantHomeLi,
                    meta: {
                        title: '配送列表',
                        allowBack: false,
                        requireAuth: true
                    },
                }
            ]
        },
        {
            path: '/MerchantOrderMore',
            name: 'MerchantOrderMore',
            component: MerchantOrderMore,
            meta: {
                title: '订单详情',
                requireAuth: true
            },
        },

    ]
});
router.beforeEach((to, from, next) => {
    let {title,requireAuth} = to.meta;
    let allowBack = true;
    if (title) {
        document.title = title
    }
    if (to.meta.allowBack !== undefined) {
        allowBack = to.meta.allowBack
    }
    localStorage.setItem('allowBack', allowBack);
    if (!allowBack) {
        history.pushState(null, null, location.href)
    }
    if (requireAuth) { // 验证是否需要登陆
        if (localStorage.getItem('accessTokenM')) { // 查询本地存储信息是否已经登陆
            next();
        } else {
            next({
                path: '/', // 未登录则跳转至login页面
                query: {redirect: to.fullPath} // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面
            });
        }
    } else {
        next();
    }
});

Vue.use(Router);
export default router