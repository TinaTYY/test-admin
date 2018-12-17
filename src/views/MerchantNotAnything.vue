<template>
    
</template>
<script>
    export default {
        name: "notAnything",
        data() {
            return {
                data: {},
                transitionName: 'fade'
            }
        },
        created() {
            this.$indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            });
        },
        methods: {
            getLogin(data) {
                let {code} = data;
                getAxios('/merchant/merchant/validate', {code}).then(res => {
                    let {code, entity, message} = res.data;
                    let query=this.$route.query;
                    if (code === 200) {
                        let {userInfo, hasUser, verifyToken} = entity;
                        let {perms} = userInfo;
                        this.$indicator.close();
                        if (hasUser === 0) {
                            this.$router.push({path: '/MerchantLogin',query});
                            sessionStorage.setItem('verifyToken', verifyToken);
                        } else {
                            let auth=perms.findIndex(function (val) { return 'storeWine' === val});
                            if (auth!== -1) {
                                for (let i in entity.userInfo) {
                                    localStorage.setItem(i + 'M', entity.userInfo[i]);
                                }
                                this.$store.state.userDate = userInfo;
                                this.$router.push({path: '/MerchantHome/MerchantHomeLi'});
                            } else {
                                alert('该账号无权限进入该页面')
                            }
                        }
                    } else {
                        this.herf()
                    }
                }).catch(err => {

                })
            },
            GetRequest() {


                let data={
                    code:this.getUrlParams('code'),
                    state:this.getUrlParams('state')
                };
                if (data.code&&data.code!='') {
                    this.getLogin(data);
                } else {
                    this.herf()
                }
            },
            herf() {
                localStorage.removeItem('accessTokenM');
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx07f943b81e1bcb69&redirect_uri=http://wechat.eighteen018.com/mp/merchant/index.html&response_type=code&scope=snsapi_userinfo&state=State#wechat_redirect'
            },
        },
        beforeMount() {
        },
        mounted(){

            this.$indicator.open();
            let accessTokenM = localStorage.getItem('accessTokenM');
            let query=this.$route.query;
            if (!accessTokenM) {
                this.GetRequest()
            } else {
                this.$router.push({path:'/MerchantHome',query})
            }
        }
    }
</script>

<style scoped>

</style>