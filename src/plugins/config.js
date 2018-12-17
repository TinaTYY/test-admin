let host = '';// 根据 process.env.NODE_ENV 的值判断当前是什么环境
let cdnHost='';

// 基础url前缀
if (process.env.NODE_ENV === 'development') {
    host = 'http://192.168.1.200';
    cdnHost='http://test.s.cdn.eighteen018.com/'
} else {
    if (window.location.host.indexOf('dev.') >= 0) {
        host = 'https://dev.api.eighteen018.com';
        cdnHost='http://test.s.cdn.eighteen018.com/'
    } else if (window.location.host.indexOf('pro.') >= 0) {
        host = 'https://pro.api.eighteen018.com';
        cdnHost='http://pro.s.cdn.eighteen018.com/'
    } else if (window.location.host.indexOf('merchant.') >= 0) {
        host = 'https://pro.api.eighteen018.com';
        cdnHost='http://pro.s.cdn.eighteen018.com/'
    } else if (window.location.host.indexOf('pre.') >= 0) {
        host = 'https://pre.api.eighteen018.com';
        cdnHost='http://pre.s.cdn.eighteen018.com/'
    } else if (window.location.host.indexOf('test.') >= 0) {
        host = 'https://test.api.eighteen018.com';
        cdnHost='http://test.s.cdn.eighteen018.com/'
    }else{
        host='http://124.65.238.78:521';
        cdnHost='http://test.s.cdn.eighteen018.com/'
    }
}

export default {
    baseURL:host,
    orderStatusList: [
        {
            label: 0,
            value: '待付款',
            status: "WAIT_FOR_PAYMENT"
        },
        {
            label: 1,
            value: '待接单',
            status: "WAIT_TAKE_ORDER"
        },
        {
            label: 2,
            value: '待发货',
            status: "TO_SEND_CARGO"
        },
        {
            label: 3,
            value: '待收货',
            status: "TO_BE_RECEIVING"
        },
        {
            label: 4,
            value: '待评价',
            status: "TO_EVALUATE"
        },
        {
            label: 5,
            value: '已评价',
            status: "EVALUATION"
        },
        {
            label: 6,
            value: '已完成',
            status: "COMPLETE"
        },
        {
            label: 10,
            value: '用户取消',
            status: "USER_CANCELLED"
        },
        {
            label: 11,
            value: '商户取消',
            status: "MERCHANT_CANCELLED"
        },
    ],
}
