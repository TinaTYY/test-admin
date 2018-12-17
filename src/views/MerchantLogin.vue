<template>
    <div id="store">
        <div id="logo">
            <img src="@/assets/img/logo.png" alt="018">
        </div>
        <div id="form">
            <div id="phone" :class="borderStyle?'borderStyle':''">
                <img src="../assets/img/user.png"/>
                <input type="tel" placeholder="请输入您的手机号" v-model.lazy="phone" @change="changePhone"
                       @focus="borderStyle=true" @blur="borderStyle=false"/>
                <div class="errMsg" v-if="errMsgOnoff" :class="phoneErro?'shake':''">
                    {{errMsg}}
                </div>
            </div>
            <div id="verification" :class="borderStyleV?'borderStyle':''">
                <img src="../assets/img/pass.png"/>
                <input type="number" placeholder="验证码" v-model.lazy="captcha" @focus="borderStyleV=true"
                       @blur="borderStyleV=false"/>
                <label @click="getVerification" v-if="!getVeriOn">{{Verification}}</label>
                <label @click="VerificationMsgToast" v-if="getVeriOn">重新获取验证码 {{VerificationMsg}}</label>
                <div class="errMsg" v-if="errMsgOnoffverification" :class="phoneErro?'shake':''">
                    {{errMsgVerification}}
                </div>
            </div>
            <p>
                <input type="checkbox" v-model="Explain" id="Explain">
                <label for="Explain"><a>确认已阅读</a> <span>说明</span></label>
            </p>
            <div id="submitContent">
                <button id="submit" @click="login">
                    <img src="@/assets/img/login.png" alt="登录">
                </button>
            </div>
        </div>

        <div class="info">商户端</div>
    </div>
</template>

<script>


    export default {
        name: "store",
        data() {
            return {
                VerificationMsg: '60 秒',
                Verification: '获取验证码',
                phone: '',
                captcha: '',
                errMsg: '',
                borderStyle: false,
                borderStyleV: false,
                errMsgOnoff: false,
                phoneErro: false,
                errMsgVerification: '',
                errMsgOnoffverification: false,
                Explain: false,
                msg: false,
                msg1: false,
                successMsg: false,
                getVeriOn: false,
                verifyToken: sessionStorage.getItem('verifyToken'),
                data: null,
            }
        },
        beforeMount() {
            let verifyToken = sessionStorage.getItem('verifyToken');
            if (!verifyToken || verifyToken === '') {
                this.$router.push('/')
            }
        },
        methods: {
            VerificationMsgToast(){
                this.$toast(this.VerificationMsg)
            },
            changePhone() {
                let parm = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
                let vm = this;
                if (vm.phone === "") {
                    vm.errMsg = '手机号不能为空';
                    vm.errMsgOnoff = true;
                    vm.phoneErro = true;
                    setTimeout(() => {
                        vm.phoneErro = false
                    }, 300);
                    return false
                } else if (!parm.test(vm.phone)) {
                    vm.errMsg = '手机号格式不正确';
                    vm.errMsgOnoff = true;
                    vm.phoneErro = true;
                    setTimeout(() => {
                        vm.phoneErro = false
                    }, 300);
                    return false
                } else {
                    vm.errMsgOnoff = false;
                    vm.phoneErro = false;
                    return true
                }
            },
            login() {
                let vm = this;
                let auth = vm.changePhone();
                if (!vm.Explain) {
                    vm.$toast('请确认阅读说明');
                    return false
                } else if (auth) {
                    let data = {
                        phone: vm.phone,
                        captcha: vm.captcha,
                        verifyToken: sessionStorage.getItem('verifyToken')
                    };
                    postAxios('/merchant/merchant/bindUser', data).then(res => {
                        let {code, entity, message} = res.data;
                        if (code === 200) {
                            let {perms} = entity;
                            let permsVal=perms.findIndex(function (val) {
                                return 'wineCabinet' === val
                            });
                            if (permsVal!== -1) {
                                for (let i in entity) {
                                    localStorage.setItem(i + 'M', entity[i]);
                                }
                                vm.$store.state.userDate = entity;
                                setTimeout(() => {
                                    vm.$router.push({path: '/MerchantHome'});
                                }, 10)
                            } else {
                                alert('该账号无权限进入');
                                vm.$router.push('/')
                            }
                        } else {
                            //当登录出现其他code 时
                            vm.$router.push('/')
                        }
                    });
                }
            },
            setTime() {
                let timeNum = 60;
                let vm = this;
                let ac = null;
                vm.getVeriOn = true;
                ac = setInterval(() => {
                    timeNum--;
                    vm.VerificationMsg = timeNum + ' 秒';
                    if (timeNum <= 0) {
                        clearInterval(ac);
                        vm.Verification = '重新获取验证码';
                        vm.getVeriOn = false
                    }
                }, 1000)

            },
            getVerification() {
                let vm = this;
                let auth = vm.changePhone();
                if (auth) {
                    let data = {
                        phone: vm.phone,
                        smsType: 3  //短信类型 1登陆注册   query	integer
                    };
                    postAxios('/merchant/sendSms', data).then(res => {
                        let {code, entity, message} = res.data;
                        if (code === 200) {
                            vm.$toast('发送短信成功');
                            vm.setTime();
                        }
                    }).catch(err => {})
                }
            },
        },
        mounted() {
            this.$indicator.close();
            let vm = this;
            vm.$watch('phone', function () {
                vm.changePhone()
            })
        }
    }

</script>

<style lang="scss">


</style>