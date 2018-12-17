<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    export default {
        name: 'app',
        created(){
            let wineCode=this.getUrlParams('wineCardCode');
            if (wineCode&&wineCode!='') {
                sessionStorage.setItem('wineCardCodeZ', wineCode);
            }
        },
        mounted(){
            window.onpopstate = (e) => {
                let allowBack = localStorage.getItem('allowBack');
                if (allowBack === 'false') {
                    if (e.target.location.hash === '#/MerchantHome/MerchantHomeLi') { // 该路由为公众号首页配置的路由信息,如：/list
                        const url = location.href.split('#')[0];
                        if (url !== undefined) {
                            wx.closeWindow()
                        }
                    } else {
                        history.go(1)
                    }
                }
            }
        },
        beforeMount(){
            let url =location.href.split('#')[0];
            getAxios('/merchant/merchant/config', {url}).then(res => {
                let {code, entity, message} = res.data;
                this.$indicator.close();
                let {appid, timestamp, noncestr, sign} = entity;
                wx.config({
                    appId: appid,
                    timestamp,
                    nonceStr: noncestr,
                    signature: sign,
                    jsApiList: ['updateAppMessageShareData', 'scanQRCode', 'hideAllNonBaseMenuItem','openLocation','getLocation']
                });
                wx.hideAllNonBaseMenuItem()
            });
        }
    }
</script>
