module.exports = {
    baseUrl:'./',
    devServer: {
        index: 'index.html',
        open: false, //启动开发服务器时打开浏览器
        proxy: {
            '/merchant': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/merchant' : ''},
                ws: true,
                changeOrigin: true
            },
        },
        allowedHosts: [
            'wechat.eighteen018.com/mp',
        ],
        disableHostCheck: true,
    },
};